import "server-only"; // Make sure you can't import this on client

import { appRouter } from "~/server/router";
import { t } from "~/server/router/trpc";
import { createContextInner } from "~/server/router/context";
import { getServerSession } from "../auth/serverSession";

const cf = t.createCallerFactory(appRouter)

export const getServerApi = async () => {
    const ctx = await createContextInner({
        session: await getServerSession()
    })

    return cf(ctx)
};