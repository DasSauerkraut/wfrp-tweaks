export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "modules/wfrp-tweaks/templates"
	];

	return loadTemplates(templatePaths);
}