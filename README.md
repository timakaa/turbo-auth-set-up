```
            ______               __              ______           __    __
           /\__  _\             /\ \            /\  _  \         /\ \__/\ \
           \/_/\ \/ __  __  _ __\ \ \____    ___\ \ \L\ \  __  __\ \ ,_\ \ \___
              \ \ \/\ \/\ \/\`'__\ \ '__`\  / __`\ \  __ \/\ \/\ \\ \ \/\ \  _ `\
               \ \ \ \ \_\ \ \ \/ \ \ \L\ \/\ \L\ \ \ \/\ \ \ \_\ \\ \ \_\ \ \ \ \
                \ \_\ \____/\ \_\  \ \_,__/\ \____/\ \_\ \_\ \____/ \ \__\\ \_\ \_\
                 \/_/\/___/  \/_/   \/___/  \/___/  \/_/\/_/\/___/   \/__/ \/_/\/_/
                 ------------------------------------------------------------------
                                      NestJS Auth Boilerplate
```

Want to start a new microservice project but don't want to deal with all problems that come with authentication? This is the perfect starting point for you.

Choose set up you want in different branches.

- `main` - gRPC, Drizzle ORM (always up to date)
- `grpc` - gRPC, Drizzle ORM
- `drizzle-impl` - TCP, Drizzle ORM
- `default-set-up` - TCP, Prisma ORM

### Installation

```bash
git clone https://github.com/turbo-labs/turbo-auth.git
cd turbo-auth
pnpm install
```

---

### Disclaimer

Add all env variables to your `.env` file.
The project have .env.example in every derictory where .env is needed.
