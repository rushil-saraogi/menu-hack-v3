<template>
    <div class="p-4 flex-col justify-center items-center">
        <div
            class="w-full h-52 bg-center bg-cover rounded-xl"
            :style="{
                'background-image': `url(${item.thumbnail.data.absolute_url})`
            }"
        >

        </div>
        <img  class="m-auto" />
        <div class="flex justify-between items-center mt-3">
            <div class="flex flex-col items-start">
                <div class="font-bold text-lg">{{ item.name }}</div>
                <div>{{ item.price.high_formatted }}</div>
            </div>
            <div>
                <PlusCircleIcon class="h-10 w-10 text-zinc-600" @click="$emit('click:addToCart')" />
            </div>
        </div>
    </div>
</template>

<script>
import { PlusCircleIcon } from "@heroicons/vue/outline";

export default {
    name: "MenuItem",

    components: { PlusCircleIcon },

    props: {
        item: {
            type: Object,
            default: null,
        }
    },

    data() {
        return {};
    },

	methods: {}
};
</script>

<style scoped>
</style>
