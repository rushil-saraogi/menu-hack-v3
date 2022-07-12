<template>
    <div class="flex items-center">
        <div class="flex flex-1 p-3 border border-zinc-200 justify-between items-center rounded-md">
            <div class="flex items-center">
                <div
                    class="w-10 h-10 bg-center bg-cover rounded-lg"
                    :style="{
                        'background-image': `url(${item.thumbnail.data.absolute_url})`,
                    }"
                ></div>
                <div class="ml-3 font-semibold">
                    {{ item.name }}
                </div>
            </div>
            <div>
                {{ item.price.high_formatted }}
            </div>
        </div>
        <TrashIcon
            class="h-5 w-5 text-zinc-400 ml-3 hover:cursor-pointer"
            @click="$emit('click:delete')"
        />
    </div>
</template>

<script>
import { TrashIcon } from "@heroicons/vue/solid";

export default {
    name: "MenuItem",

    components: { TrashIcon },

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
