<script lang="ts">
	import '@drop-in/graffiti';
	import favicon from '$lib/assets/favicon.svg';
	import {resolve} from '$app/paths'
	import './style.css'
	import { get_user } from './user.remote';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { children } = $props();


	const user = $derived(await get_user())

	function logout(){
      authClient.signOut({
        fetchOptions:{
          onSuccess:async()=>{
            await get_user().refresh();goto(resolve('/auth/login'))
          }
        }
      })
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<header>
    <div class="layout-readable center split">
        <a href={resolve("/")}>Blog</a>
        {#if user.id}
            <button onclick={logout}>Logout</button>
        {/if}
    </div>
</header>

<main class="layout-readable center">
	{@render children()}
</main>

<style>
    header {
        border-bottom:solid 1px var(--tint-or-shade)
    }
</style>
