import React from "react";

export default function Layout({children, edit}: {
    children: React.ReactNode,
    edit: React.ReactNode
}) {
    return (
        <>
            {edit}
            {children}
        </>
    )
}