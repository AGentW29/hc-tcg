import {Appearance, Cosmetic} from 'common/cosmetics/types'
import {PlayerEntity} from 'common/entities'
import {PlayerId} from 'common/models/player-model'
import {Message, MessageTable, messages} from 'common/redux-messages'
import {EarnedAchievement} from 'common/types/achievements'
import {RematchData} from 'common/types/app'
import {HermitAttackType} from 'common/types/attack'
import {Deck, Tag} from 'common/types/deck'
import {
	GameOutcome,
	LocalCurrentCoinFlip,
	LocalGameState,
} from 'common/types/game-state'
import {Message as ChatMessage} from 'common/types/game-state'
import {
	LocalCardInstance,
	PlayerInfo,
	SlotInfo,
	Update,
} from 'common/types/server-requests'
import {AnyTurnActionData} from 'common/types/turn-action-data'
import {Dispatch} from 'react'
import {useDispatch} from 'react-redux'
import {LocalDatabase} from './game/database/database-reducer'
import {MODAL_COMPONENTS} from './game/tasks/action-modals-saga'
import {
	LocalSetting,
	LocalSettings,
} from './local-settings/local-settings-reducer'
import {ConnectionError} from './session/session-reducer'

export const localMessages = messages('clientLocalMessages', {
	SOCKET_CONNECTING: null,
	SOCKET_CONNECT: null,
	SOCKET_DISCONNECT: null,
	SOCKET_CONNECT_ERROR: null,
	LOGIN: null,
	PLAYER_SESSION_SET: null,
	PLAYER_INFO_SET: null,
	NOT_CONNECTING: null,
	CONNECTED: null,
	CONNECTING_MESSAGE: null,
	DISCONNECT: null,
	LOGOUT: null,
	UPDATES_LOAD: null,
	TOAST_OPEN: null,
	TOAST_CLOSE: null,
	EVERY_TOAST_CLOSE: null,
	USERNAME_SET: null,
	MINECRAFT_NAME_SET: null,
	MATCHMAKING_JOIN_PUBLIC_QUEUE: null,
	MATCHMAKING_JOIN_PRIVATE_QUEUE: null,
	MATCHMAKING_SPECTATE_PRIVATE_GAME: null,
	MATCHMAKING_CREATE_PRIVATE_GAME: null,
	MATCHMAKING_JOIN_QUEUE_SUCCESS: null,
	MATCHMAKING_CREATE_GAME_SUCCESS: null,
	MATCHMAKING_CREATE_BOSS_GAME: null,
	MATCHMAKING_REPLAY_GAME: null,
	INVALID_REPLAY: null,
	MATCHMAKING_LEAVE: null,
	GAME_LOCAL_STATE_RECIEVED: null,
	GAME_LOCAL_STATE_SET: null,
	GAME_START: null,
	GAME_END: null,
	GAME_CARD_SELECTED_SET: null,
	GAME_MODAL_OPENED_SET: null,
	GAME_SLOT_PICKED: null,
	GAME_ATTACK_START: null,
	GAME_TURN_ACTION: null,
	GAME_END_OVERLAY_SHOW: null,
	GAME_CLOSE: null,
	GAME_COIN_FLIP_SET: null,
	GAME_OPPONENT_CONNECTION_SET: null,
	GAME_ACTIONS_HERMIT_CHANGE_CONFIRM: null,
	CHAT_MESSAGE: null,
	CHAT_UPDATE: null,
	GAME_TURN_END: null,
	GAME_ACTIONS_ATTACK: null,
	GAME_ACTIONS_END_TURN: null,
	GAME_UPDATE: null,
	GAME_SPECTATOR_LEAVE: null,
	SETTINGS_SET: null,
	SETTINGS_RESET: null,
	ALL_SETTINGS_RESET: null,
	SOUND_PLAY: null,
	SOUND_SECTION_CHANGE: null,
	PLAY_VOICE_TEST: null,
	QUEUE_VOICE: null,
	SET_ID_AND_SECRET: null,
	RESET_ID_AND_SECRET: null,
	DATABASE_SET: null,
	INSERT_DECK: null,
	UPDATE_DECK: null,
	DELETE_DECK: null,
	DELETE_TAG: null,
	UPDATE_DECKS: null,
	SELECT_DECK: null,
	IMPORT_DECK: null,
	EXPORT_DECK: null,
	GRAB_CURRENT_IMPORT: null,
	MAKE_INFO_PUBLIC: null,
	NEW_PLAYER: null,
	SHOW_TOOLTIP: null,
	HIDE_TOOLTIP: null,
	SHOW_DROPDOWN: null,
	HIDE_DROPDOWN: null,
	COSMETICS_SET: null,
	COSMETIC_UPDATE: null,
	OVERVIEW: null,
	//Rematches
	RECIEVE_REMATCH: null,
	CANCEL_REMATCH: null,
	MATCHMAKING_REMATCH: null,
})

type Messages = [
	{type: typeof localMessages.SOCKET_CONNECT},
	{type: typeof localMessages.SOCKET_CONNECTING},
	{type: typeof localMessages.SOCKET_DISCONNECT},
	{type: typeof localMessages.SOCKET_CONNECT_ERROR},
	{type: typeof localMessages.LOGIN; login_type: 'new-account'; name: string},
	{
		type: typeof localMessages.LOGIN
		login_type: 'sync'
		uuid: string
		secret: string
	},
	{
		type: typeof localMessages.PLAYER_SESSION_SET
		player: {
			playerName: string
			censoredPlayerName: string
			playerId: PlayerId
			playerSecret: string
		}
	},
	{type: typeof localMessages.PLAYER_INFO_SET; player: PlayerInfo},
	{type: typeof localMessages.NOT_CONNECTING},
	{type: typeof localMessages.CONNECTED},
	{type: typeof localMessages.CONNECTING_MESSAGE; message: string},
	{type: typeof localMessages.DISCONNECT; errorMessage?: ConnectionError},
	{type: typeof localMessages.LOGOUT},
	{type: typeof localMessages.UPDATES_LOAD; updates: Array<Update>},
	{
		type: typeof localMessages.TOAST_OPEN
		open: boolean
		title: string
		description: string
		image?: string
	},
	{type: typeof localMessages.TOAST_CLOSE; id: number},
	{type: typeof localMessages.EVERY_TOAST_CLOSE},
	{type: typeof localMessages.USERNAME_SET; name: string},
	{type: typeof localMessages.MINECRAFT_NAME_SET; name: string},
	{type: typeof localMessages.OVERVIEW; id: number},
	{type: typeof localMessages.MATCHMAKING_JOIN_PUBLIC_QUEUE},
	{
		type: typeof localMessages.MATCHMAKING_JOIN_PRIVATE_QUEUE
		code: string
	},
	{
		type: typeof localMessages.MATCHMAKING_SPECTATE_PRIVATE_GAME
		code: string
	},
	{type: typeof localMessages.MATCHMAKING_JOIN_QUEUE_SUCCESS},
	{type: typeof localMessages.MATCHMAKING_CREATE_PRIVATE_GAME},
	{
		type: typeof localMessages.MATCHMAKING_CREATE_GAME_SUCCESS
		gameCode: string
		spectatorCode: string
	},
	{type: typeof localMessages.MATCHMAKING_LEAVE},
	{
		type: typeof localMessages.MATCHMAKING_CREATE_BOSS_GAME
		bossType?: 'evilx' | 'new'
	},
	{
		type: typeof localMessages.MATCHMAKING_REPLAY_GAME
		id: number
	},
	{type: typeof localMessages.INVALID_REPLAY},
	{
		type: typeof localMessages.GAME_LOCAL_STATE_RECIEVED
		localGameState: LocalGameState
		time: number
	},
	{
		type: typeof localMessages.GAME_LOCAL_STATE_SET
		localGameState: LocalGameState
		time: number
	},
	{type: typeof localMessages.GAME_START; spectatorCode?: string},
	{type: typeof localMessages.GAME_END},
	{
		type: typeof localMessages.GAME_CARD_SELECTED_SET
		card: LocalCardInstance | null
	},
	{
		type: typeof localMessages.GAME_MODAL_OPENED_SET
		id: keyof typeof MODAL_COMPONENTS | null
		info?: any
	},
	{
		type: typeof localMessages.GAME_SLOT_PICKED
		slotInfo: SlotInfo
		player: PlayerEntity
		row?: number
		index?: number
	},
	{
		type: typeof localMessages.GAME_ATTACK_START
		attackType: 'single-use' | 'primary' | 'secondary'
		extra?: Record<string, {hermitId: string; type: 'primary' | 'secondary'}>
	},
	{
		type: typeof localMessages.GAME_END_OVERLAY_SHOW
		outcome: GameOutcome
		earnedAchievements: Array<EarnedAchievement> | null
		gameEndTime: number
	},
	{
		type: typeof localMessages.GAME_CLOSE
	},
	{
		type: typeof localMessages.GAME_COIN_FLIP_SET
		coinFlip: LocalCurrentCoinFlip | null
	},
	{type: typeof localMessages.GAME_OPPONENT_CONNECTION_SET; connected: boolean},
	{
		type: typeof localMessages.GAME_ACTIONS_HERMIT_CHANGE_CONFIRM
		confirmed: boolean
	},
	{type: typeof localMessages.CHAT_MESSAGE; message: string},
	{type: typeof localMessages.CHAT_UPDATE; messages: Array<ChatMessage>},
	{type: typeof localMessages.GAME_TURN_END},
	{
		type: typeof localMessages.GAME_ACTIONS_ATTACK
		attackType: HermitAttackType
	},
	{
		type: typeof localMessages.GAME_TURN_ACTION
		action: AnyTurnActionData
	},
	{type: typeof localMessages.GAME_ACTIONS_END_TURN},
	{type: typeof localMessages.GAME_UPDATE},
	{type: typeof localMessages.GAME_SPECTATOR_LEAVE},
	{type: typeof localMessages.SETTINGS_SET; setting: LocalSetting},
	{type: typeof localMessages.SETTINGS_RESET; key: keyof LocalSettings},
	{type: typeof localMessages.ALL_SETTINGS_RESET},
	{type: typeof localMessages.SOUND_PLAY; path: string},
	{type: typeof localMessages.SOUND_SECTION_CHANGE; section: any},
	{type: typeof localMessages.PLAY_VOICE_TEST},
	{type: typeof localMessages.QUEUE_VOICE; lines: Array<string>},
	{
		type: typeof localMessages.SET_ID_AND_SECRET
		userId: string
		secret: string
	},
	{type: typeof localMessages.RESET_ID_AND_SECRET},
	{type: typeof localMessages.DATABASE_SET; data: LocalDatabase},
	{type: typeof localMessages.INSERT_DECK; deck: Deck},
	{type: typeof localMessages.UPDATE_DECK; deck: Deck},
	{type: typeof localMessages.SELECT_DECK; deck: Deck},
	{type: typeof localMessages.DELETE_DECK; deck: Deck},
	{type: typeof localMessages.DELETE_TAG; tag: Tag},
	{type: typeof localMessages.UPDATE_DECKS; newActiveDeck?: Deck},
	{
		type: typeof localMessages.IMPORT_DECK
		code: string
		newActiveDeck?: boolean
		newName: string
		newIcon: string
		newIconType: string
	},
	{type: typeof localMessages.EXPORT_DECK; code: string},
	{type: typeof localMessages.GRAB_CURRENT_IMPORT; code: string | null},
	{type: typeof localMessages.MAKE_INFO_PUBLIC; code: string; public: boolean},
	{type: typeof localMessages.NEW_PLAYER},
	{
		type: typeof localMessages.SHOW_TOOLTIP
		anchor: React.RefObject<HTMLDivElement>
		tooltip: React.ReactNode
		tooltipHeight: number
		tooltipWidth: number
	},
	{type: typeof localMessages.HIDE_TOOLTIP},
	{
		type: typeof localMessages.SHOW_DROPDOWN
		dropdown: React.ReactNode
		x: number
		y: number
		direction: 'up' | 'down'
		align: 'left' | 'right'
	},
	{type: typeof localMessages.HIDE_DROPDOWN},
	{
		type: typeof localMessages.COSMETICS_SET
		appearance: Appearance
	},
	{type: typeof localMessages.COSMETIC_UPDATE; cosmetic: Cosmetic},
	{type: typeof localMessages.RECIEVE_REMATCH; rematch: RematchData | null},
	{type: typeof localMessages.CANCEL_REMATCH},
	{type: typeof localMessages.MATCHMAKING_REMATCH},
]

/** A message used locally on the client to update global state */
export type LocalMessage = Message<Messages>

/** A message used locally on the client to update global state */
export type LocalMessageTable = MessageTable<Messages>

export const useMessageDispatch = useDispatch as () => Dispatch<LocalMessage>
