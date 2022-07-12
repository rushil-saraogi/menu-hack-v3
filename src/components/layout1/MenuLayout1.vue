<template>
    <div class="text-center flex flex-col relative">
        <!-- Cart -->
        <div
            class="p-4 border border-zinc-300 fixed bg-white left-0 w-full z-20"
            :class="{
                'rounded-b-2xl': selected === NO_SELECTION,
                'rounded-none': selected !== NO_SELECTION,
            }"
            ref="cart"
            :style="{
                transition: '0.6s ease 0s',
                transitionProperty: 'top, border-radius',
                top: `${cartPosition}px`,
            }"
        >
            <div class="grid gap-4">
                <TransitionGroup
                    enter-active-class="duration-500 ease-out delay-200"
                    enter-from-class="transform translate-x-full"
                    enter-to-class="translate-x-0"
                    leave-active-class="duration-300 ease-in"
                    leave-from-class="translate-x-0"
                    leave-to-class="transform translate-x-full"
                >
                    <CartItem
                        v-for="(item, index) in cart"
                        :key="item.id"
                        :item="item"
                        @click:delete="deleteItemFromCart(index)"
                    />
                </TransitionGroup>
            </div>

            <div class="mt-3" v-show="!!cart.length">
				<div class="flex justify-between font-semibold">
					<div>Total</div>
					<div>${{ cartTotal }}</div>
				</div>

                <button
                    v-show="!!cart.length"
                    class="p-3 flex items-center justify-center bg-orange-500 rounded-lg text-white mb-5 mt-3 font-semibold w-full disabled:bg-zinc-400"
                >
                    Checkout
                </button>
            </div>

            <div @click="toggleCart">
                <div class="flex justify-between items-center">
                    <ShoppingCartIcon class="h-5 w-5 text-zinc-600" />
                    <div
                        class="ml-2 h-8 w-8 flex items-center justify-center bg-zinc-300 rounded-full font-bold"
                        :class="{
                            jello: cartAnimationVisible,
                        }"
                    >
                        {{ cart.length }}
                    </div>
                </div>

                <DragIcon :show="cart.length > 0" />
            </div>
        </div>

        <!-- Cart overlay -->
        <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="transform opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="transform opacity-0"
        >
            <div
                class="h-full w-full fixed bg-black/60 z-10"
                v-show="!!cartVisible"
                @click="toggleCart"
            />
        </Transition>

        <!-- Logo -->
        <div class="h-80 mt-20 flex justify-center items-center">
            <img
                class="logo m-auto"
                src="https://matko-103991.square.site/uploads/b/019794f0-8fba-11ea-9b73-cbe6ae53dda4/95e10de0-946a-11ea-a3e8-398c70ef0241.jpg"
            />
        </div>

        <!-- Categories -->
        <div>
            <div
                v-for="(category, index) in categories"
                ref="categories"
                :key="category.id"
                class="pt-4 fixed left-0 w-full flex flex-col"
                :class="{
                    [backgroundClasses[index]]: true,
                    'rounded-t-2xl': index !== selected,
                }"
                :style="{
                    minHeight: `${viewportHeight}px`,
                    top: `${calculateCategoryTop(index)}px`,
                    bottom: '0px',
                    transition: 'top 0.8s ease 0s',
                    transitionProperty: 'top, border-radius',
                }"
            >
                <div>
                    <Transition
                        enter-active-class="duration-700 ease-out"
                        enter-from-class="transform opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="duration-500 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="transform opacity-0"
                    >
                        <DragIcon
                            v-show="index === selected"
                            @click="selectCategory(NO_SELECTION)"
                        />
                    </Transition>
                    <div
                        class="text-lg font-semibold mt-4 poppins"
                        @click="selectCategory(index)"
                    >
                        {{ category.name }}
                    </div>
                </div>

                <div class="mt-6 overflow-scroll">
                    <MenuItem
                        v-for="item in getItems(category.site_category_id)"
                        :key="item.id"
                        :item="item"
                        @click:addToCart="addToCart(item)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import categories from "../../data/categories.json";
import menu from "../../data/menu.json";
import MenuItem from "./MenuItem.vue";
import CartItem from "./CartItem.vue";
import DragIcon from "./DragIcon.vue";

const NO_SELECTION = 99999;
const CATEGORY_HEIGHT = 80;
const CART_HEIGHT = 70;

const backgroundClasses = [
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
];

export default {
    name: "MenuLayout1",

    components: { MenuItem, ShoppingCartIcon, DragIcon, CartItem },

    data() {
        return {
            CATEGORY_HEIGHT,
            CART_HEIGHT,
            categories: categories.filter((category) => {
                const items = this.getItems(category.site_category_id);
                return !!items.length;
            }),
            menu,
            backgroundClasses,
            selected: NO_SELECTION,
            NO_SELECTION,
            viewportHeight: window.innerHeight,
            cartVisible: false,
            cart: [],
            cartPosition: 0,
            cartAnimationVisible: false,
            animationInterval: null,
        };
    },

    computed: {
        cartTotal() {
			const num = this.cart.reduce((acc, item) => {
                return acc + item.price.high;
            }, 0);

            return Math.round(num * 100) / 100;
        },
    },

    created() {
        nextTick(() => {
            this.calcCartPosition();
        });
    },

    watch: {
        cart: {
            deep: true,
            handler() {
                nextTick(() => {
                    this.calcCartPosition();
                });
            },
        },

        cartAnimationVisible() {
            this.calcCartPosition();
        },
    },

    methods: {
        getItems(categoryId) {
            return menu.data.filter(
                (item) =>
                    item.categories.data[0].site_category_id === categoryId
            );
        },

        toggleCart() {
            if (this.cart.length === 0) {
                return;
            }

            this.cartVisible = !this.cartVisible;
            this.calcCartPosition();
        },

        selectCategory(id) {
            this.selected = id;
        },

        isCategorySelected(id) {
            return this.selected === id;
        },

        addToCart(item) {
            this.cart.push(item);
            this.toggleCartAnimation();
        },

        deleteItemFromCart(index) {
            this.cart.splice(index, 1);

            if (this.cart.length === 0) {
                this.cartVisible = false;
            }
        },

        calcCartPosition() {
            if (
                !this.$refs.cart || // Ref not available yet
                (!this.cartVisible && !this.cart.length) || // Cart is closed and empty
                this.cartVisible // Cart is already open
            ) {
                this.cartPosition = 0;
                return;
            }

            const cartTotalHeight = this.$refs.cart.offsetHeight;

			if (this.cartAnimationVisible) {
				this.cartPosition = this.cart.length === 1
					? this.cartPosition
					: -(cartTotalHeight - CART_HEIGHT - 240);
				return;
			}

            this.cartPosition = -(cartTotalHeight - CART_HEIGHT);
            return;
        },

        calculateCategoryTop(index) {
            if (this.selected === NO_SELECTION) {
                return (
                    this.viewportHeight -
                    CATEGORY_HEIGHT * this.categories.length +
                    CATEGORY_HEIGHT * index
                );
            }

            if (index === this.selected) {
                return this.CART_HEIGHT;
            }

            return this.viewportHeight;
        },

        toggleCartAnimation() {
            clearInterval(this.animationInterval);
            this.cartAnimationVisible = true;

            this.animationInterval = setInterval(() => {
                this.cartAnimationVisible = false;
            }, 1500);
        },
    },
};
</script>

<style scoped>
.logo {
    height: 150px;
}
</style>
