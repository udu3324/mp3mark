<script>
	import { injectAnalytics } from '@vercel/analytics/sveltekit'
	import '../app.css';

	let { children } = $props();
	
	injectAnalytics()
</script>

{@render children()}
