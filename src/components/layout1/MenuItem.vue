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

            <div
                class="p-2.5 z-10 h-full w-full flex flex-col justify-between items-end relative"
            >
                <div class="flex gap-1">
                    <div
                        v-for="(pref, index) in item.product_type_details.dietary_preferences"
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

                    <PlusCircleIcon
                        class="h-10 w-10 text-white"
                        @click="$emit('click:addToCart')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PlusCircleIcon } from "@heroicons/vue/solid";

export default {
    name: "MenuItem",

    components: { PlusCircleIcon },

    props: {
        item: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {};
    },

    methods: {},
};
</script>

<style scoped></style>
