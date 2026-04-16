/*
 Copyright 2026 Element Creations Ltd.

 SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
 Please see LICENSE files in the repository root for full details.
 */

import React, { type JSX, useCallback } from "react";
import { CheckIcon, CloseIcon, UserAddSolidIcon } from "@vector-im/compound-design-tokens/assets/web/icons";
import { Button, PageHeader } from "@vector-im/compound-web";

import { InviteKind } from "../InviteDialogTypes.ts";
import { type Member } from "../../../../utils/direct-messages.ts";
import BaseDialog from "../BaseDialog.tsx";
import { type ScreenName } from "../../../../PosthogTrackers.ts";
import { DMRoomTile } from "./DMRoomTile.tsx";

interface Props {
    /** Callback that will be called when the 'Continue' button is clicked. */
    onContinue: () => void;

    /** Callback that will be called when the 'close' or 'Cancel' button is clicked or 'Escape' is pressed. */
    onCancel: () => void;

    /** Callback that will be called when the 'Remove' button is clicked. */
    onRemove: () => void;

    /** Optional Posthog ScreenName to supply during the lifetime of this dialog. */
    screenName: ScreenName | undefined;

    /** The type of invite dialog: whether we are starting a new DM, or inviting users to an existing room */
    kind: InviteKind.Dm | InviteKind.Invite;

    /** The users whose identities we don't know */
    users: Member[];
}

/**
 *
 * Figma: https://www.figma.com/design/chAcaQAluTuRg6BsG4Npc0/-3163--Inviting-Unknown-People?node-id=150-17719&t=ISAikbnj97LM4NwT-0
 */
export default function UnknownIdentityUsersWarningDialog(props: Props): JSX.Element {
    const userListItem = useCallback((u: Member) => <DMRoomTile member={u} key={u.userId} />, []);

    // TODO i18n, plurals, different wording for invites
    const title = "Start a chat with these new contacts?";
    const headerText = "You currently don't have any chats with these people. Confirm inviting them before continuing.";

    const buttons =
        props.kind == InviteKind.Invite
            ? inviteButtons({
                  onInvite: props.onContinue,
                  onRemove: props.onRemove,
              })
            : dmButtons({
                  onCancel: props.onCancel,
                  onContinue: props.onContinue,
              });

    return (
        <BaseDialog
            onFinished={props.onCancel}
            className="mx_UnknownIdentityUsersWarningDialog"
            screenName={props.screenName}
        >
            <div className="mx_UnknownIdentityUsersWarningDialog_headerContainer">
                <PageHeader Icon={UserAddSolidIcon} heading={title}>
                    <p>{headerText}</p>
                </PageHeader>
            </div>

            <ul className="mx_UnknownIdentityUsersWarningDialog_userList" role="listbox">
                {props.users.map(userListItem)}
            </ul>

            <div className="mx_UnknownIdentityUsersWarningDialog_buttons">{buttons}</div>
        </BaseDialog>
    );
}

function dmButtons(props: { onContinue: () => void; onCancel: () => void }): JSX.Element {
    return (
        <>
            <Button size="lg" kind="secondary" onClick={props.onCancel}>
                Cancel
            </Button>
            <Button size="lg" kind="primary" onClick={props.onContinue}>
                Continue
            </Button>
        </>
    );
}

function inviteButtons(props: { onInvite: () => void; onRemove: () => void }): JSX.Element {
    return (
        <>
            <Button size="lg" kind="secondary" onClick={props.onRemove} Icon={CloseIcon}>
                Remove
            </Button>
            <Button size="lg" kind="primary" onClick={props.onInvite} Icon={CheckIcon}>
                Invite
            </Button>
        </>
    );
}
