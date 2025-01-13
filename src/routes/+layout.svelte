<script>
	import { db } from "$lib/db.js"
    import { onMount } from "svelte";

	import { injectAnalytics } from '@vercel/analytics/sveltekit'
	//import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	import '../app.css';

	// biome-ignore lint/style/useConst: <explanation>
	let { children } = $props();
	
	injectAnalytics()
	//injectSpeedInsights()

	onMount(() => {
		db.preference.get(1).then(pref => {
			console.log("loaded preference db sucessfully")

            if (pref.darkMode) {
                const html = document.documentElement
                html.classList.add('dark')
            }
        }).catch(() => {
            console.log("error loading preferences! might be missing. trying to create it...")
			
			//worse case scenario if db is very old
            db.preference.add({
                darkMode: false, 
	    	    playSnap: true, 
	    	    analysisEnterAction: "flag"
            }).then(() => {
                console.log("sucessfully created preference db")
            }).catch(() => {
                console.log("could not create preference db!!!! SECOND FAIL")
            })
        })
	})
</script>

{@render children()}
