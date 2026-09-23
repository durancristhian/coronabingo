# Coronabingo

Coronabingo lets people play bingo together in shared rooms. Its historical charity-event workflow also handled donation registrations before a game.

## Language

**Room**:
A shared bingo game with a host, players, assigned cards, and called numbers.

**Host**:
The player who directs a room's game and controls its called numbers.
_Avoid_: Admin without qualification, event organizer.

**Room setup**:
The preparation of a room's player list, host, cards, and game options before play.
_Avoid_: Site administration.

**Player**:
A participant with assigned bingo cards in a room. The host is also a player.

**Room code**:
An emoji sequence used to access room functions that require it, including the host's cards when host protection is enabled.
_Avoid_: Account password.

**Charity event**:
A historical organized bingo fundraiser with a description, donation registrations, and a dedicated room.
_Avoid_: Event when it could mean an analytics event or a game action.

**Event organizer**:
The person who creates a charity event and reviews its donation registrations. This role is distinct from hosting its bingo game.
_Avoid_: Admin without qualification, host.

**Registration**:
A request to join a charity event, containing the participant's name, phone number, donation receipt, and optional comment. Approval assigns the participant cards in the event's room.

**Donation receipt**:
An image submitted with a charity-event registration as evidence of a donation.
