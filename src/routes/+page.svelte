<script lang="ts">
	import { get_all_posts} from './posts.remote'
	import {resolve} from '$app/paths'
</script>


<ol>
	{#each await get_all_posts() as post (post.id)}
		<li>
		<div>
		    <a href={resolve(`/post/${post.id}`)}>{post.title}</a>
		</div>
		</li>
	{/each}
</ol>
