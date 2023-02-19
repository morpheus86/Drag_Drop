export function Autobind(_1, _2, descriptor) {
    const originalMethod = descriptor.value;
    const newDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const bindFn = originalMethod.bind(this);
            return bindFn;
        },
    };
    return newDescriptor;
}
//# sourceMappingURL=autobind-decorator.js.map