<script>
	import { injectAnalytics } from '@vercel/analytics/sveltekit'
	//import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	import '../app.css';

	// biome-ignore lint/style/useConst: <explanation>
	let { children } = $props();
	
	injectAnalytics()
	//injectSpeedInsights()
</script>

{@render children()}
