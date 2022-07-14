<template>
    <div class="flex-col justify-center items-center">
        <div
            class="w-full h-56 bg-center bg-cover rounded-xl overflow-hidden relative"
            :style="{
                'background-image': `url(${item.thumbnail.data.absolute_url})`,
            }"
        >
            <div
                class="w-full h-full absolute top-0 left-0 z-0"
                :style="{
                    'background-image':
                        'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))',
                }"
            ></div>

            <Transition
                enter-active-class="duration-200 ease-out"
                enter-from-class="transform opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="transform opacity-0"
            >
                <div
                    v-if="toggleVisible"
                    class="h-full w-full p-2.5 absolute top-0 left-0 z-20 bg-black/70 flex items-end justify-end"
                >
                    <div class="flex gap-3 items-center">
                        <MinusOutline
                            class="h-10 w-10 text-white"
                            @click="
                                $emit('click:deleteItemFromCart');
                                showToggle();
                            "
                        />
                        <div class="text-white text-lg font-bold">
                            {{ count }}
                        </div>
                        <PlusOutline
                            class="h-10 w-10 text-white"
                            @click="
                                $emit('click:addToCart');
                                showToggle();
                            "
                        />
                    </div>
                </div>
            </Transition>

            <div
                class="p-2.5 z-10 h-full w-full flex flex-col justify-between items-end relative"
            >
                <div class="flex gap-1">
                    <div
                        v-for="(pref, index) in item.product_type_details
                            .dietary_preferences"
                        :key="index"
                        class="text-xs px-2 py-1 bg-green-500/80 font-semibold rounded-3xl text-white"
                    >
                        {{ pref }}
                    </div>
                </div>
                <div class="flex justify-between w-full items-end">
                    <div class="flex flex-col items-start">
                        <div class="text-white font-bold text-md text-left">
                            {{ item.name }}
                        </div>
                        <div class="text-white text-sm">
                            {{ item.price.high_formatted }}
                        </div>
                    </div>

                    <div v-if="!toggleVisible" @click="showToggle">
                        <div
                            v-if="count > 0"
                            class="h-10 w-10 flex items-center justify-center"
                        >
                            <div
                                class="text-md text-black h-8 w-8 bg-white flex items-center justify-center font-bold rounded-full"
                            >
                                {{ count }}
                            </div>
                        </div>
                        <PlusCircleIcon
                            v-else
                            class="h-10 w-10 text-white"
                            @click="$emit('click:addToCart')"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    PlusCircleIcon as PlusOutline,
    MinusCircleIcon as MinusOutline,
} from "@heroicons/vue/outline";
import { PlusCircleIcon } from "@heroicons/vue/solid";

export default {
    name: "MenuItem",

    components: { PlusCircleIcon, PlusOutline, MinusOutline },

    props: {
        item: {
            type: Object,
            default: null,
        },
        count: {
            tyle: Number,
            default: 0,
        },
    },

    data() {
        return {
            toggleVisible: false,
            toggleInterval: null,
        };
    },

    methods: {
        showToggle() {
            if (this.toggleInterval) {
                clearInterval(this.toggleInterval);
            }

            this.toggleVisible = true;

            this.toggleInterval = setInterval(() => {
                this.toggleVisible = false;
            }, 2000);
        },
    },
};
</script>

<style scoped></style>
