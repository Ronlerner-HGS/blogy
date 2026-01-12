<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import {resolve} from '$app/paths'
	import { get_user } from '../../user.remote';

	console.log('page load')
	let error = $state('');

	async function signup(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = form.email.value;
		const username = form.username.value;
		const password = form.password.value;
		const passwordconfirm = form.passwordconfirm.value;

		if (password != passwordconfirm) {
			error = "Passwords don't match";
			return;
		}

		if (!password || !email || !username || !passwordconfirm) {
			error = 'All fields are required';
			return;
		}

		await authClient.signUp.email({
		email,
		password,
		name:username
		},{
		onSuccess:async ()=>{
		  get_user().refresh();
          goto(resolve('/'))
		}
		});
	}
</script>

<div class="box-1">
	<h1>Sign up</h1>
	<form onsubmit={signup}>
		<div class="row">
			<label>
				Email:
				<input required type="email" id="email" />
			</label>
		</div>
		<div class="row">
			<label>
				Username:
				<input required type="username" id="username" />
			</label>
		</div>
		<div class="row">
			<label>
				Password:
				<input required type="password" id="password" />
			</label>
		</div>
		<div class="row">
			<label>
				Confirm Password:
				<input required type="password" id="passwordconfirm" />
			</label>
		</div>
		{#if error}
		<p style:color="var(--red)">{error}</p>
		{/if}
		<button type="submit">Sign Up</button>
	</form>
</div>


<p>Already have an Account? <a href={resolve("/auth/login")}>Login</a></p>
