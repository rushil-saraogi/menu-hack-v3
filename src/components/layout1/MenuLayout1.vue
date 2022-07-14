<template>
    <div
        class="text-center flex flex-col relative"
        :style="{
            height: this.viewportHeight,
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto',
        }"
    >
        <!-- Cart -->
        <div
            class="px-4 py-3 border border-zinc-300 fixed bg-white left-0 w-full z-20"
            ref="cart"
            :style="{
                transition: enableCartTransitions ? '0.3s ease 0s' : '',
                transitionProperty: 'top, border-radius',
                top: `${cartPosition}px`,
            }"
        >
            <div class="grid gap-4">
                <TransitionGroup
                    enter-active-class="duration-500 ease-out delay-200"
                    enter-from-class="transform translate-x-full opacity-0"
                    enter-to-class="translate-x-0 opacity-100"
                    leave-active-class="duration-300 ease-in"
                    leave-from-class="translate-x-0 opacity-100"
                    leave-to-class="transform translate-x-full opacity-0"
                >
                    <CartItem
                        v-for="item in cart"
                        :key="item.id"
                        :item="item"
                        @click:delete="deleteItemFromCart(item)"
                    />
                </TransitionGroup>
            </div>

            <div class="mt-3" v-show="!!cart.length">
                <!-- <div class="flex justify-between font-semibold">
                    <div>Total</div>
                    <div>${{ cartTotal }}</div>
                </div> -->

                <button
                    v-show="!!cart.length"
                    class="p-3 flex items-center justify-center bg-orange-500 rounded-lg text-white mb-5 mt-3 font-semibold w-full disabled:bg-zinc-400"
                >
                    Checkout
                </button>
            </div>

            <div
                @touchstart="handleCartTouchStart"
                @touchmove="handleCartTouchMove"
                @touchend="handleCartTouchEnd"
            >
                <div class="flex justify-between items-center">
                    <ShoppingCartIcon class="h-5 w-5 text-zinc-600" />
                    <div
                        class="ml-2 h-8 w-8 flex items-center justify-center bg-zinc-200 rounded-full font-bold"
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
                @click="toggleCart(false)"
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
                class="fixed left-0 w-full flex flex-col"
                :class="{
                    [backgroundClasses[index]]: true,
                    'pt-0': index !== selected,
                    'pt-4 pb-16': index === selected,
                }"
                :style="{
                    minHeight: `${viewportHeight}px`,
                    top: `${categoryTopPositions[index]}px`,
                    bottom: '0px',
                    transition: enableCategoryTransitions
                        ? 'top 0.3s ease 0s'
                        : '',
                    transitionProperty: 'top, border-radius',
                }"
                @touchstart="(e) => handleCategoryTouchStart(e, index)"
                @touchmove="handleCategoryTouchMove"
                @touchend="handleCategoryTouchEnd"
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
                        <DragIcon :show="index === selected" />
                    </Transition>
                    <div class="text-md p-4 font-semibold poppins noselect">
                        {{ category.name }}
                    </div>
                </div>

                <div
                    class="grid gap-4 px-4 pb-4 pt-1"
					:class="{
						'overflow-scroll': this.categoryTopPositions[index] === CART_HEIGHT,
						'overflow-hidden': this.categoryTopPositions[index] !== CART_HEIGHT,
					}"
                    ref="menus"
                    @touchstart="handleMenuTouchStart"
                    @touchmove="(e) => handleMenuTouchMove(e, index)"
                    @touchend="(e) => handleMenuTouchEnd(e, index)"
                >
                    <MenuItem
                        v-for="item in getItems(category.site_category_id)"
                        :key="item.id"
                        :item="item"
                        :count="getItemCount(item.id)"
                        @click:addToCart="addToCart(item)"
						@click:deleteItemFromCart="deleteItemFromCart(item)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import { getTouches } from "../../util/touch";
import categories from "../../data/categories.json";
import menu from "../../data/menu.json";
import MenuItem from "./MenuItem.vue";
import CartItem from "./CartItem.vue";
import DragIcon from "./DragIcon.vue";

const NO_SELECTION = 99999;
const CATEGORY_HEIGHT = 56;
const CART_HEIGHT = 60;

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
            categoryTopPositions: [],
            cartAnimationVisible: false,
            animationInterval: null,
            enableCategoryTransitions: true,
            enableCartTransitions: true,
            categoryTouchSelected: NO_SELECTION,
            categoryTouchStart: 0,
            categoryTouchDragPrevious: 0,
            categoryTouchDrag: 0,
            cartTouchStart: 0,
            cartTouchDrag: 0,
            menuTouchDragPrevious: 0,
            menuTouchDrag: 0,
            menuTouchStart: 0,
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
            this.calcCategoryTopPositions();
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

        selected() {
            this.calcCategoryTopPositions();
        },

        categoryTouchDrag(dragValue) {
            this.categoryTopPositions = this.categoryTopPositions.map(
                (position, index) => {
                    if (index === this.categoryTouchSelected) {
                        const newPosition =
                            position -
                            (this.categoryTouchDragPrevious - dragValue);
                        // Max height
                        if (
                            newPosition < this.CART_HEIGHT ||
                            dragValue < this.cartHeight
                        ) {
                            return this.CART_HEIGHT;
                        }

                        // Min height
                        if (
                            newPosition > this.getCategoryMinPosition(index) ||
                            dragValue > this.getCategoryMinPosition()
                        ) {
                            return this.getCategoryMinPosition(index);
                        }

                        if (this.$refs.menus[index].scrollTop !== 0) {
                            return position;
                        }

                        return newPosition;
                    }

                    return position;
                }
            );
        },

        cartTouchDrag(newVal) {
            const cartHeight = this.$refs.cart.offsetHeight;
            const relativePosition = newVal - cartHeight;

            if (relativePosition > 0) {
                this.cartPosition = 0;
                return;
            }

            this.cartPosition = relativePosition;
        },
    },

    methods: {
        getItems(categoryId) {
            return menu.data.filter(
                (item) =>
                    item.categories.data[0].site_category_id === categoryId
            );
        },

        toggleCart(show = null) {
            if (this.cart.length === 0) {
                return;
            }

            this.cartVisible = show || !this.cartVisible;
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

        handleCategoryClick(index) {
            if (this.selected === index) {
                this.selectCategory(NO_SELECTION);
                return;
            }

            this.selectCategory(index);
        },

        handleCategoryTouchStart(evt, index) {
            const firstTouch = getTouches(evt)[0];
            this.categoryTouchStart = firstTouch.clientY;
            this.categoryTouchDrag = firstTouch.clientY;
            this.categoryTouchDragPrevious = firstTouch.clientY;
            this.categoryTouchSelected = index;
            this.enableCategoryTransitions = false;
        },

        handleCategoryTouchMove(evt) {
            if (!this.categoryTouchStart) {
                return;
            }

            this.categoryTouchDragPrevious = this.categoryTouchDrag;
            this.categoryTouchDrag = evt.touches[0].clientY;
        },

        handleCategoryTouchEnd() {
            this.enableCategoryTransitions = true;

			// debugger; //eslint-disable-line

			// For taps - 
			if (Math.abs(this.categoryTouchDrag - this.categoryTouchStart) < 50) {
				if (this.categoryTopPositions[this.categoryTouchSelected] !== CART_HEIGHT) {
					this.selected = this.categoryTouchSelected;
				}
			} else if (this.categoryTouchDrag < this.categoryTouchStart) {
				this.selected = this.categoryTouchSelected;
			} else {
				this.selected = NO_SELECTION;
			}

            this.calcCategoryTopPositions();
        },

        handleCartTouchStart(evt) {
            const firstTouch = getTouches(evt)[0];
            this.cartTouchStart = firstTouch.clientY;
            this.enableCartTransitions = false;
        },

        handleCartTouchMove(evt) {
            if (!this.cartTouchStart) {
                return;
            }

            this.cartTouchDrag = evt.touches[0].clientY;
        },

        handleCartTouchEnd() {
            // debugger; // eslint-disable-line
            this.enableCartTransitions = true;

            if (this.cartTouchDrag > this.cartTouchStart) {
                this.toggleCart(true);
            } else {
                this.toggleCart(false);
            }
        },

        handleMenuTouchStart(evt) {
            const firstTouch = getTouches(evt)[0];
            this.menuTouchDrag = firstTouch.clientY;
            this.menuTouchDragPrevious = firstTouch.clientY;
            this.menuTouchDragStart = firstTouch.clientY;
        },

        handleMenuTouchMove(evt, index) {
            if (!this.menuTouchDragStart) {
                return;
            }

            if (
                this.menuTouchDragPrevious < this.menuTouchDrag &&
                this.$refs.menus[index].scrollTop !== 0
            ) {
                evt.stopPropagation();
                return;
            }

            this.menuTouchDragPrevious = this.menuTouchDrag;
            this.menuTouchDrag = evt.touches[0].clientY;
        },

        handleMenuTouchEnd(evt, index) {
            if (
                this.menuTouchDragPrevious < this.menuTouchDrag &&
                this.$refs.menus[index].scrollTop !== 0
            ) {
                evt.stopPropagation();
                return;
            }
        },

        deleteItemFromCart(item) {
			const idx = this.cart.findIndex(cartItem => cartItem.id === item.id)
            this.cart.splice(idx, 1);
			this.toggleCartAnimation();

            if (this.cart.length === 0) {
                this.cartVisible = false;
            }
        },

        calcCartPosition() {
			if (!this.$refs.cart || this.cartVisible || (!this.cartVisible && !this.cart.length)) {
				this.cartPosition = 0;
				return;
			} 

			const cartTotalHeight = this.$refs.cart.offsetHeight;

			if (this.cartAnimationVisible) {
                this.cartPosition =
                    this.cart.length === 1
                        ? this.cartPosition
                        : -(cartTotalHeight - CART_HEIGHT - 160);
                return;
            }

			this.cartPosition = -(cartTotalHeight - CART_HEIGHT);
            return;
        },

        calcCategoryTopPositions() {
            let newPositions = Array(this.categories.length).fill(0);

            this.categoryTopPositions = newPositions.map((_, index) => {
                if (this.selected === NO_SELECTION) {
                    return this.getCategoryMinPosition(index);
                }

                if (index === this.selected) {
                    return this.CART_HEIGHT;
                }

                return this.viewportHeight;
            });
        },

        getCategoryMinPosition(index) {
            return (
                this.viewportHeight -
                CATEGORY_HEIGHT * this.categories.length +
                CATEGORY_HEIGHT * index
            );
        },

        getItemCount(id) {
            return this.cart.reduce((acc, item) => {
                if (item.id === id) {
                    return acc + 1;
                }

                return acc;
            }, 0);
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
