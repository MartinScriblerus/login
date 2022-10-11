export default function PostgresAdapter(client, options = {}) {
	console.log("------- IN POSTGRES ADAPTER -------");
    console.log("WHAT IS CLIENT ???? ", client);
    console.log("WHAT ARE OPTIONS ??? ", options);

    return {
		// async createUser(user) {
        //     console.log("^^^^ trying to create user... ", user)

		// 	try {
		// 		const sql = `
        // INSERT INTO users (user_name, email, email_verified, image, subusers_array) 
        // VALUES ($1, $2, $3, $4, $5) 
        // RETURNING id, user_name, email, email_verified, image, subusers_array`;
		// 		let result = await client.query(sql, [user.user_name, user.email, user.emailVerified, user.image, user.subusers]);
		// 		console.log("^^ Result after create user ", result);
        //         return result.rows[0];
		// 	} catch (err) {
		// 		console.log("error: ", err);
		// 		return;
		// 	}
		// },
        async getUserByName(user_name){
            try {
                const sql = `select * from users where user_name = $1`;
                let result = await client.query(sql, [user_name]);
                console.log("^^ HEYYY! ", result);
                return result.rows[0];
            } catch(err) {
				console.log(err);
				return;
            }
        },
		async getUser(id) {
            console.log("^^ trying to get user");
			try {
				const sql = `select * from users where id = $1`;
				let result = await client.query(sql, [id]);
                console.log("^^ *** client ID match ***: ",result)
				return result.rows[0];
			} catch (err) {
				console.log(err);
				return;
			}
		},
		async getUserByEmail(email) {
            console.log("^^ trying to get user by email");
			try {
				const sql = `select * from users where email = $1`;
				let result = await client.query(sql, [email]);
                console.log("^^ *** client email match *** ", result);
				return result.rows[0];
			} catch (err) {
				console.log("error in email check: ",  err);
				return;
			}
		},
		async getUserByAccount({ providerAccountId, provider }) {
            
            try {
				const sql = `
          select u.* from users u join accounts a on u.id = a.user_id 
          where 
          a.provider_id = $1 
          and 
          a.provider_account_id = $2`;

				const result = await client.query(sql, [provider, providerAccountId]);
				return result.rows[0];
			} catch (err) {
				console.log(err);
			}
		},
		async updateUser(user) {
            console.log("^^ user to update: ", user);
			try {
			} catch (err) {
				console.log(err);
				return;
			}
		},
		async linkAccount(account) {
			try {
				const sql = `
        insert into accounts 
        (
          user_id, 
          provider_id, 
          provider_type, 
          provider_account_id, 
          access_token,
          access_token_expires
        )
        values ($1, $2, $3, $4, $5, to_timestamp($6))`;

				const params = [
					account.userId,
					account.provider,
					account.type,
					account.providerAccountId,
					account.access_token,
					account.expires_at,
				];
				await client.query(sql, params);
				return account;
			} catch (err) {
				console.log(err);
				return;
			}
		},
		async createSession({ sessionToken, userId, expires }) {
			console.log("^^ creating a session in adapter...", userId);
            try {
				const sql = `insert into sessions (session_token, user_id, expires) values ($1, $2, $3)`;
				await client.query(sql, [userId, expires, sessionToken]);
				// console.log("USER ID IS ... ", userId);
                return { sessionToken, userId, expires };
			} catch (err) {
				console.log(err);
				return;
			}
		},
		async getSessionAndUser(sessionToken) {
            console.log("^^ get session and user in adapter: ", sessionToken)
            try {
                const sqlTest = `select * from users`;
                let result = await client.query(sql, user.id)
                console.log("^^ sqlTest!!!: ", result);
        
            } catch {
        
            }
            try {
				let result;
				result = await client.query("select * from sessions where session_token = $1", [sessionToken]);
                console.log("^^ result is: ", result);
				let session = result.rows[0];
                if(!session){
                    return;
                }
				result = await client.query("select * from users where id = $1", [session.user_id]);
				let user = result.rows[0];

				return {
					session,
					user,
				};
			} catch (err) {
				console.log(err);
				return;
			}
		},
		async updateSession({ sessionToken }) {
			console.log("updating Session", sessionToken);

			return;
		},
		async deleteSession(sessionToken) {
			try {
				const sql = `delete from sessions where session_token = $1`;
				await client.query(sql, [sessionToken]);
			} catch (err) {
				console.log(err);
				return;
			}
		},
	};
}