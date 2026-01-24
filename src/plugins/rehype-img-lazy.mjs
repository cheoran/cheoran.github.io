export function rehypeImgLazy() {
	return (tree) => {
		const visit = (node) => {
			if (!node || typeof node !== "object") return;
			if (node.type === "element" && node.tagName === "img") {
				node.properties = node.properties || {};
				if (node.properties.loading == null) {
					node.properties.loading = "lazy";
				}
				if (node.properties.decoding == null) {
					node.properties.decoding = "async";
				}
			}
			if (Array.isArray(node.children)) {
				node.children.forEach(visit);
			}
		};
		visit(tree);
	};
}
