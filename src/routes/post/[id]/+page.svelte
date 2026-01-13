<script lang="ts">
	import { page } from "$app/state";
	import {resolve} from '$app/paths'
    import { get_post_by_id } from "../../posts.remote";
    import {get_user} from '../../user.remote'
    const user = await get_user()
    const post = await get_post_by_id(page.params.id!);
</script>

<h3>
    {post?.title}
</h3>

<p>
    {post?.body}
</p>

{#if user.role=='admin'}
    <a href={resolve(`/admin/post/${page.params.id!}` )}>edit</a>
{/if}
