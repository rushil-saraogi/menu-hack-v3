<template>
    <div
        class="h-1 w-8 bg-neutral-800/50 mx-auto rounded-xl"
        :class="{
            'bg-neutral-800/50': show,
            'bg-neutral-800/0': !show
        }"
        :style="{
            transition: 'background-color 0.5s ease 0s',
        }"
    ></div>
</template>

<script>
export default {
    name: "DragIcon",

    components: {},

    props: {
        show: {
            type: Boolean,
            default: true,
        }
    },

    data() {
        return {};
    },

    methods: {},
};
</script>

<style scoped></style>
