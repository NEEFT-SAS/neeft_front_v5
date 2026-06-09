<template>
  <CustomModal
    :model-value="true"
    :title="modalTitle"
    :desc="modalDescription"
    icon="lucide:gamepad-2"
    theme="app"
    size="xl"
    @close="closeModal"
  >
    <form :id="formId" class="profile-game-modal" novalidate @submit.prevent="onSubmit">
      <section class="profile-game-modal__section">
        <h3 class="profile-game-modal__section-title">General</h3>

        <div class="profile-game-modal__grid">
          <CustomInputText
            v-if="isEditMode"
            :model-value="selectedGameName"
            name="gameName"
            label="Jeu"
            disabled
          />

          <CustomInputSelection
            v-else
            v-model="form.gameId"
            name="gameId"
            label="Jeu"
            placeholder="Selectionner un jeu"
            :options="gameOptions"
            :errorMessage="fieldErrors.gameId"
            searchable
            required
          />

          <CustomInputText
            v-model="form.trackerUrl"
            name="trackerUrl"
            label="Tracker"
            placeholder="https://..."
            :disabled="isSaving"
          />

          <CustomInputSwitch
            v-model="form.isRecruitable"
            name="isRecruitable"
            label="Disponible pour recrutement"
            on-label="Oui"
            off-label="Non"
            :disabled="isSaving"
          />

          <CustomInputSwitch
            v-model="form.isFavoriteGame"
            name="isFavoriteGame"
            label="Jeu favori"
            on-label="Oui"
            off-label="Non"
            :disabled="isSaving"
          />
        </div>
      </section>

      <section class="profile-game-modal__section">
        <h3 class="profile-game-modal__section-title">Competitif</h3>

        <p v-if="!selectedGame" class="profile-game-modal__empty">
          Selectionne un jeu pour afficher les champs disponibles.
        </p>

        <div v-else-if="hasCompetitiveFields" class="profile-game-modal__grid">
          <CustomInputMultiselect
            v-if="showPlatformField"
            v-model="form.platformIds"
            name="platformIds"
            label="Plateformes"
            placeholder="Selectionner des plateformes"
            :options="platformOptions"
            :errorMessage="fieldErrors.platformIds"
            searchable
            :required="isRequiredField('platformIds')"
            :disabled="isSaving"
          />

          <CustomInputMultiselect
            v-if="showPositionField"
            v-model="form.positionIds"
            name="positionIds"
            label="Positions"
            placeholder="Selectionner des positions"
            :options="positionOptions"
            :errorMessage="fieldErrors.positionIds"
            searchable
            :required="isRequiredField('positionIds')"
            :disabled="isSaving"
          />

          <CustomInputMultiselect
            v-if="showCharacterField"
            v-model="form.characterIds"
            name="characterIds"
            label="Personnages"
            placeholder="Selectionner des personnages"
            :options="characterOptions"
            :errorMessage="fieldErrors.characterIds"
            searchable
            :required="isRequiredField('characterIds')"
            :disabled="isSaving"
          />
        </div>

        <p v-else class="profile-game-modal__empty">
          Aucun champ competitif disponible pour ce jeu.
        </p>
      </section>

      <section v-if="showModeRanksField" class="profile-game-modal__section">
        <div class="profile-game-modal__section-header">
          <h3 class="profile-game-modal__section-title">Modes et rangs</h3>

          <CustomButton
            label="Ajouter"
            theme="app"
            variant="outlined"
            color="secondary"
            size="sm"
            left-icon="lucide:plus"
            :disabled="isSaving || !canAddModeRank"
            @click="addModeRank"
          />
        </div>

        <p v-if="fieldErrors.modeRanks" class="profile-game-modal__error">
          {{ fieldErrors.modeRanks }}
        </p>

        <div class="profile-game-modal__mode-list">
          <article
            v-for="(modeRank, index) in form.modeRanks"
            :key="modeRank.rowId"
            class="profile-game-modal__mode-card"
          >
            <div class="profile-game-modal__mode-header">
              <span>Rang {{ index + 1 }}</span>

              <button
                v-if="form.modeRanks.length > minModeRankRows"
                class="profile-game-modal__icon-button"
                type="button"
                :aria-label="`Supprimer le rang ${index + 1}`"
                :disabled="isSaving"
                @click="removeModeRank(index)"
              >
                <Icon name="lucide:x" aria-hidden="true" />
              </button>
            </div>

            <div class="profile-game-modal__grid">
              <CustomInputSelection
                v-model="modeRank.modeId"
                :name="`modeRanks.${index}.modeId`"
                label="Mode"
                placeholder="Selectionner un mode"
                :options="modeOptionsForRow(modeRank)"
                :errorMessage="fieldErrors[`modeRanks.${modeRank.rowId}.modeId`]"
                searchable
                :required="modeRankRequired"
                :disabled="isSaving"
              />

              <CustomInputSelection
                v-model="modeRank.rankId"
                :name="`modeRanks.${index}.rankId`"
                label="Rang"
                placeholder="Selectionner un rang"
                :options="rankOptions"
                :errorMessage="fieldErrors[`modeRanks.${modeRank.rowId}.rankId`]"
                searchable
                :required="modeRankRequired"
                :disabled="isSaving"
              />

              <CustomInputText
                v-model="modeRank.elo"
                :name="`modeRanks.${index}.elo`"
                label="Elo"
                placeholder="2200"
                :errorMessage="fieldErrors[`modeRanks.${modeRank.rowId}.elo`]"
                :disabled="isSaving"
              />
            </div>
          </article>
        </div>
      </section>

      <section v-if="hasAccountFields" class="profile-game-modal__section">
        <h3 class="profile-game-modal__section-title">Compte</h3>

        <div class="profile-game-modal__grid">
          <CustomInputText
            v-if="showAccountField('username')"
            v-model="form.username"
            name="username"
            label="Pseudo"
            placeholder="Anebris"
            :errorMessage="fieldErrors.username"
            :required="isRequiredField('username')"
            :disabled="isSaving"
          />

          <CustomInputText
            v-if="showAccountField('tagLine')"
            v-model="form.tagLine"
            name="tagLine"
            label="Tagline"
            placeholder="EUW"
            :errorMessage="fieldErrors.tagLine"
            :required="isRequiredField('tagLine')"
            :disabled="isSaving"
          />

          <CustomInputText
            v-if="showAccountField('battleTag')"
            v-model="form.battleTag"
            name="battleTag"
            label="BattleTag"
            placeholder="Anebris#1234"
            :errorMessage="fieldErrors.battleTag"
            :required="isRequiredField('battleTag')"
            :disabled="isSaving"
          />

          <CustomInputText
            v-if="showAccountField('region')"
            v-model="form.region"
            name="region"
            label="Region"
            placeholder="EU"
            :errorMessage="fieldErrors.region"
            :required="isRequiredField('region')"
            :disabled="isSaving"
          />

          <CustomInputText
            v-if="showAccountField('puuid')"
            v-model="form.puuid"
            name="puuid"
            label="PUUID"
            placeholder="Identifiant Riot"
            :errorMessage="fieldErrors.puuid"
            :required="isRequiredField('puuid')"
            :disabled="isSaving"
          />
        </div>
      </section>
    </form>

    <template #footer>
      <CustomButton
        label="Annuler"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        :disabled="isSaving"
        @click="closeModal"
      />
      <CustomButton
        :label="isEditMode ? 'Modifier' : 'Ajouter'"
        theme="app"
        variant="filled"
        color="primary"
        type="submit"
        size="sm"
        :form="formId"
        :disabled="isSaving"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type {
  CreatePlayerGameDTO,
  RscGameCharacterPresenter,
  RscGameModePresenter,
  RscGamePlatformPresenter,
  RscGamePositionPresenter,
  RscGamePresenter,
  RscGameRankPresenter,
  UpdatePlayerGameDTO,
  UserGamePresenter
} from '@neeft-sas/shared'
import type { PropType } from 'vue'

type SelectOption = {
  value: string | number
  label: string
  icon?: string
}

type GameFieldKey = 'platformIds' | 'positionIds' | 'characterIds' | 'modeRanks'
type AccountFieldKey = 'username' | 'tagLine' | 'battleTag' | 'region' | 'puuid'
type FormFieldKey = GameFieldKey | AccountFieldKey

type GameFieldSettings = {
  fields: GameFieldKey[]
  accountFields: AccountFieldKey[]
  requiredFields: FormFieldKey[]
  modeRankRequired: boolean
}

type ModeRankForm = {
  rowId: string
  modeId: string | number
  rankId: string | number
  elo: string
}

type GameWithResources = UserGamePresenter & {
  rscGame?: RscGamePresenter | null
  game?: RscGamePresenter | null
  rscGamePlatforms?: RscGamePlatformPresenter[]
  rscGamePositions?: RscGamePositionPresenter[]
  rscGameCharacters?: RscGameCharacterPresenter[]
  payload?: Record<string, unknown> | null
}

const props = defineProps({
  modalId: { type: Number, required: true },
  game: { type: Object as PropType<UserGamePresenter | null>, default: null },
  usedGames: { type: Array as PropType<UserGamePresenter[]>, default: () => [] },
  createGame: {
    type: Function as PropType<(input: CreatePlayerGameDTO) => Promise<unknown>>,
    required: true
  },
  updateGame: {
    type: Function as PropType<(playerGameId: string | number, input: UpdatePlayerGameDTO) => Promise<unknown>>,
    required: true
  }
})

const modalStore = useModalStore()
const resourcesStore = useResourcesStore()
const toast = useToast()
const generatedId = useId()

const formId = computed(() => `profile-game-form-${generatedId}`)
const isEditMode = computed(() => Boolean(props.game))
const modalTitle = computed(() => isEditMode.value ? 'Modifier le jeu' : 'Ajouter un jeu')
const modalDescription = computed(() => isEditMode.value ? selectedGameName.value : 'Ajoute un jeu a ton profil.')
const isSaving = ref(false)
const fieldErrors = reactive<Record<string, string>>({})

let modeRankRowIndex = 0
let isHydratingForm = false

const fallbackSettings: GameFieldSettings = {
  fields: ['platformIds', 'positionIds', 'characterIds', 'modeRanks'],
  accountFields: ['username'],
  requiredFields: [],
  modeRankRequired: false
}

const settingsByGameKey: Record<string, GameFieldSettings> = {
  'league-of-legends': {
    fields: ['platformIds', 'positionIds', 'characterIds', 'modeRanks'],
    accountFields: ['username', 'tagLine'],
    requiredFields: ['platformIds', 'username', 'tagLine'],
    modeRankRequired: true
  },
  valorant: {
    fields: ['platformIds', 'positionIds', 'characterIds', 'modeRanks'],
    accountFields: ['username', 'tagLine'],
    requiredFields: ['platformIds', 'positionIds', 'username', 'tagLine'],
    modeRankRequired: true
  },
  'rocket-league': {
    fields: ['platformIds', 'positionIds', 'modeRanks'],
    accountFields: ['username'],
    requiredFields: ['platformIds', 'username'],
    modeRankRequired: false
  },
  'overwatch-2': {
    fields: ['platformIds', 'positionIds', 'characterIds', 'modeRanks'],
    accountFields: ['battleTag', 'region'],
    requiredFields: [],
    modeRankRequired: true
  },
  fortnite: {
    fields: ['platformIds', 'modeRanks'],
    accountFields: ['username'],
    requiredFields: ['username'],
    modeRankRequired: true
  },
  brawl: {
    fields: ['modeRanks'],
    accountFields: ['username'],
    requiredFields: ['username'],
    modeRankRequired: false
  },
  'brawl-stars': {
    fields: ['modeRanks'],
    accountFields: ['username'],
    requiredFields: ['username'],
    modeRankRequired: false
  },
  cs2: {
    fields: ['platformIds', 'positionIds', 'modeRanks'],
    accountFields: ['username'],
    requiredFields: ['username'],
    modeRankRequired: false
  },
  'rainbow-six-siege': {
    fields: ['platformIds', 'positionIds', 'modeRanks'],
    accountFields: ['username'],
    requiredFields: ['username'],
    modeRankRequired: false
  }
}

const gameKeyAliases: Record<string, string> = {
  lol: 'league-of-legends',
  leagueoflegends: 'league-of-legends',
  league_of_legends: 'league-of-legends',
  rl: 'rocket-league',
  rocketleague: 'rocket-league',
  rocket_league: 'rocket-league',
  overwatch: 'overwatch-2',
  ow2: 'overwatch-2',
  brawlstars: 'brawl-stars',
  brawlstar: 'brawl-stars',
  brawl_star: 'brawl-stars',
  fn: 'fortnite',
  r6: 'rainbow-six-siege',
  r6s: 'rainbow-six-siege'
}

const form = reactive({
  gameId: '' as string | number,
  trackerUrl: '',
  isRecruitable: false,
  isFavoriteGame: false,
  platformIds: [] as Array<string | number>,
  positionIds: [] as Array<string | number>,
  characterIds: [] as Array<string | number>,
  modeRanks: [] as ModeRankForm[],
  username: '',
  tagLine: '',
  battleTag: '',
  region: '',
  puuid: ''
})

const sortByOrderAndName = <TItem extends { name?: string | null, order?: number | null }>(items: TItem[]) => {
  return [...items].sort((left, right) => {
    const leftOrder = Number(left.order ?? 0)
    const rightOrder = Number(right.order ?? 0)

    if (leftOrder !== rightOrder) return leftOrder - rightOrder
    return String(left.name ?? '').localeCompare(String(right.name ?? ''))
  })
}

const toPositiveNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const normalizeGameKey = (value: unknown) => {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\s]+/g, '-')
}

const compactText = (value: unknown) => {
  const text = String(value ?? '').trim()
  return text.length > 0 ? text : null
}

const toInputIcon = (value: unknown) => {
  const icon = String(value ?? '')
  if (!icon || icon.startsWith('http') || icon.startsWith('/')) return undefined
  return icon.includes(':') ? icon : undefined
}

const toOptions = <TItem extends { id: number, name?: string | null, icon?: string | null, order?: number | null }>(items: TItem[]) => {
  return sortByOrderAndName(items).map<SelectOption>(item => ({
    value: item.id,
    label: String(item.name ?? ''),
    icon: toInputIcon(item.icon)
  })).filter(option => option.label.length > 0)
}

const readResourceGameId = (game: UserGamePresenter | null | undefined) => {
  const item = game as GameWithResources | null | undefined
  return toPositiveNumber(item?.gameId ?? item?.rscGame?.id ?? item?.game?.id)
}

const readPlayerGameId = (game: UserGamePresenter | null | undefined) => {
  return toPositiveNumber((game as { id?: unknown } | null | undefined)?.id)
}

const readPlayerGameResource = (game: UserGamePresenter | null | undefined) => {
  const item = game as GameWithResources | null | undefined
  return item?.rscGame ?? item?.game ?? null
}

const readResourceItems = <TItem>(game: RscGamePresenter | null, primaryKey: string, fallbackKey: string) => {
  const record = game as Record<string, unknown> | null
  const value = record?.[primaryKey] ?? record?.[fallbackKey]
  return Array.isArray(value) ? value as TItem[] : []
}

const readIdsFromPlayerGame = (game: UserGamePresenter | null | undefined, idKey: keyof UserGamePresenter, resourceKey: keyof GameWithResources) => {
  const item = game as GameWithResources | null | undefined
  const directValue = item?.[idKey]

  if (Array.isArray(directValue)) {
    return directValue.map(toPositiveNumber).filter((value): value is number => value !== null)
  }

  const resourceValue = item?.[resourceKey]
  if (!Array.isArray(resourceValue)) return []

  return resourceValue
    .map(resource => toPositiveNumber((resource as { id?: unknown }).id))
    .filter((value): value is number => value !== null)
}

const readAccountValue = (game: UserGamePresenter | null | undefined, field: AccountFieldKey) => {
  const item = game as Record<string, unknown> | null | undefined
  const sources = [
    item?.account,
    item?.payload,
    item?.leagueOfLegendsProfile,
    item?.rocketLeagueProfile,
    item?.valorantProfile,
    item?.brawlStarsProfile,
    item?.fortniteProfile,
    item?.overwatchProfile
  ]

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue
    const record = source as Record<string, unknown>
    const value = record[field] ?? (field === 'tagLine' ? record.tagline : undefined)
    if (value !== null && value !== undefined) return String(value)
  }

  return ''
}

const createModeRankRow = (values: Partial<ModeRankForm> = {}): ModeRankForm => {
  modeRankRowIndex += 1

  return {
    rowId: `mode-rank-${modeRankRowIndex}`,
    modeId: values.modeId ?? '',
    rankId: values.rankId ?? '',
    elo: values.elo ?? ''
  }
}

const games = computed(() => {
  return [...(resourcesStore.resources.rscGames ?? [])]
    .sort((left, right) => String(left.name ?? '').localeCompare(String(right.name ?? '')))
})

const currentPlayerGameId = computed(() => readPlayerGameId(props.game))
const currentResourceGameId = computed(() => readResourceGameId(props.game))

const usedResourceGameIds = computed(() => {
  return new Set(
    props.usedGames
      .filter(game => readPlayerGameId(game) !== currentPlayerGameId.value)
      .map(readResourceGameId)
      .filter((value): value is number => value !== null)
  )
})

const gameOptions = computed(() => {
  return games.value
    .filter(game => {
      if (isEditMode.value) return game.id === currentResourceGameId.value
      return !usedResourceGameIds.value.has(game.id)
    })
    .map<SelectOption>(game => ({
      value: game.id,
      label: game.name,
      icon: toInputIcon(game.icon)
    }))
})

const selectedGame = computed(() => {
  const selectedId = toPositiveNumber(form.gameId)

  if (selectedId !== null) {
    return games.value.find(game => game.id === selectedId) ?? readPlayerGameResource(props.game)
  }

  return readPlayerGameResource(props.game)
})

const selectedGameName = computed(() => selectedGame.value?.name ?? '')

const selectedGameKey = computed(() => {
  const selected = selectedGame.value
  const rawKey = normalizeGameKey(selected?.slug ?? selected?.name ?? '')
  return gameKeyAliases[rawKey] ?? rawKey
})

const currentSettings = computed(() => {
  return settingsByGameKey[selectedGameKey.value] ?? fallbackSettings
})

const platforms = computed(() => readResourceItems<RscGamePlatformPresenter>(selectedGame.value, 'rscGamePlatforms', 'platforms'))
const positions = computed(() => readResourceItems<RscGamePositionPresenter>(selectedGame.value, 'rscGamePositions', 'positions'))
const characters = computed(() => readResourceItems<RscGameCharacterPresenter>(selectedGame.value, 'rscGameCharacters', 'characters'))
const modes = computed(() => readResourceItems<RscGameModePresenter>(selectedGame.value, 'rscGameModes', 'modes'))
const ranks = computed(() => readResourceItems<RscGameRankPresenter>(selectedGame.value, 'rscGameRanks', 'ranks'))

const platformOptions = computed(() => toOptions(platforms.value))
const positionOptions = computed(() => toOptions(positions.value))
const characterOptions = computed(() => toOptions(characters.value))
const modeOptions = computed(() => toOptions(modes.value))
const rankOptions = computed(() => toOptions(ranks.value))

const hasField = (field: GameFieldKey) => currentSettings.value.fields.includes(field)
const showPlatformField = computed(() => hasField('platformIds') && platformOptions.value.length > 0)
const showPositionField = computed(() => hasField('positionIds') && positionOptions.value.length > 0)
const showCharacterField = computed(() => hasField('characterIds') && characterOptions.value.length > 0)
const showModeRanksField = computed(() => hasField('modeRanks') && modeOptions.value.length > 0 && rankOptions.value.length > 0)
const hasCompetitiveFields = computed(() => showPlatformField.value || showPositionField.value || showCharacterField.value)
const hasAccountFields = computed(() => currentSettings.value.accountFields.length > 0 && Boolean(selectedGame.value))
const modeRankRequired = computed(() => currentSettings.value.modeRankRequired)
const minModeRankRows = computed(() => modeRankRequired.value ? 1 : 0)
const canAddModeRank = computed(() => form.modeRanks.length < modeOptions.value.length)

const isRequiredField = (field: FormFieldKey) => currentSettings.value.requiredFields.includes(field)
const showAccountField = (field: AccountFieldKey) => currentSettings.value.accountFields.includes(field)

const modeOptionsForRow = (row: ModeRankForm) => {
  const usedModeIds = new Set(
    form.modeRanks
      .filter(item => item.rowId !== row.rowId)
      .map(item => String(item.modeId))
      .filter(Boolean)
  )

  return modeOptions.value.filter(option => !usedModeIds.has(String(option.value)) || String(option.value) === String(row.modeId))
}

const clearErrors = () => {
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })
}

const setFieldError = (field: string, message: string) => {
  fieldErrors[field] = message
}

const hasValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0
  return compactText(value) !== null
}

const validateIds = (field: 'platformIds' | 'positionIds' | 'characterIds', visible: boolean) => {
  if (!visible || !isRequiredField(field) || hasValue(form[field])) return
  setFieldError(field, 'Ce champ est requis.')
}

const validateAccountField = (field: AccountFieldKey) => {
  if (!showAccountField(field) || !isRequiredField(field) || hasValue(form[field])) return
  setFieldError(field, 'Ce champ est requis.')
}

const validateModeRanks = () => {
  if (!showModeRanksField.value) return

  const activeRows = form.modeRanks.filter(row => hasValue(row.modeId) || hasValue(row.rankId) || hasValue(row.elo))

  if (modeRankRequired.value && activeRows.length === 0) {
    setFieldError('modeRanks', 'Au moins un mode et un rang sont requis.')
  }

  activeRows.forEach(row => {
    if (!hasValue(row.modeId)) {
      setFieldError(`modeRanks.${row.rowId}.modeId`, 'Ce champ est requis.')
    }

    if (!hasValue(row.rankId)) {
      setFieldError(`modeRanks.${row.rowId}.rankId`, 'Ce champ est requis.')
    }

    if (hasValue(row.elo)) {
      const elo = Number(row.elo)
      if (!Number.isInteger(elo) || elo < 0) {
        setFieldError(`modeRanks.${row.rowId}.elo`, 'Elo invalide.')
      }
    }
  })
}

const validateForm = () => {
  clearErrors()

  if (!isEditMode.value && !toPositiveNumber(form.gameId)) {
    setFieldError('gameId', 'Ce champ est requis.')
  }

  validateIds('platformIds', showPlatformField.value)
  validateIds('positionIds', showPositionField.value)
  validateIds('characterIds', showCharacterField.value)
  currentSettings.value.accountFields.forEach(validateAccountField)
  validateModeRanks()

  return Object.keys(fieldErrors).length === 0
}

const toNumberIds = (values: Array<string | number>) => {
  return values.map(toPositiveNumber).filter((value): value is number => value !== null)
}

const buildModeRanks = () => {
  if (!showModeRanksField.value) return []

  return form.modeRanks
    .filter(row => hasValue(row.modeId) && hasValue(row.rankId))
    .map(row => ({
      modeId: Number(row.modeId),
      rankId: Number(row.rankId),
      elo: hasValue(row.elo) ? Number(row.elo) : null
    }))
}

const buildAccountPayload = () => {
  return currentSettings.value.accountFields.reduce<Record<string, unknown>>((payload, field) => {
    const value = compactText(form[field])
    if (value !== null) payload[field] = value
    return payload
  }, {})
}

const buildPayload = (): CreatePlayerGameDTO | UpdatePlayerGameDTO => {
  const base = {
    isRecruitable: form.isRecruitable,
    isFavoriteGame: form.isFavoriteGame,
    trackerUrl: compactText(form.trackerUrl),
    platformIds: showPlatformField.value ? toNumberIds(form.platformIds) : null,
    positionIds: showPositionField.value ? toNumberIds(form.positionIds) : null,
    characterIds: showCharacterField.value ? toNumberIds(form.characterIds) : null,
    modeRanks: buildModeRanks(),
    payload: buildAccountPayload()
  }

  if (isEditMode.value) return base

  return {
    ...base,
    gameId: Number(form.gameId)
  }
}

const hydrateModeRanks = (game: UserGamePresenter | null | undefined) => {
  const modeRanks = ((game as Record<string, unknown> | null | undefined)?.modeRanks ?? []) as Record<string, unknown>[]

  return modeRanks.reduce<ModeRankForm[]>((rows, modeRank) => {
    const mode = modeRank.rscGameMode as Record<string, unknown> | undefined
    const rank = modeRank.rscGameRank as Record<string, unknown> | undefined
    const legacyMode = modeRank.mode as Record<string, unknown> | undefined
    const legacyRank = modeRank.rank as Record<string, unknown> | undefined
    const modeId = toPositiveNumber(modeRank.modeId ?? mode?.id ?? legacyMode?.id)
    const rankId = toPositiveNumber(modeRank.rankId ?? rank?.id ?? legacyRank?.id)

    if (modeId === null && rankId === null) return rows

    rows.push(createModeRankRow({
      modeId: modeId ?? '',
      rankId: rankId ?? '',
      elo: modeRank.elo === null || modeRank.elo === undefined ? '' : String(modeRank.elo)
    }))

    return rows
  }, [])
}

const ensureModeRankRows = () => {
  if (!showModeRanksField.value) {
    form.modeRanks = []
    return
  }

  if (form.modeRanks.length < minModeRankRows.value) {
    form.modeRanks = [createModeRankRow()]
  }
}

const resetGameSpecificFields = () => {
  form.platformIds = []
  form.positionIds = []
  form.characterIds = []
  form.modeRanks = []
  form.username = ''
  form.tagLine = ''
  form.battleTag = ''
  form.region = ''
  form.puuid = ''
  ensureModeRankRows()
}

const hydrateForm = () => {
  isHydratingForm = true

  try {
    const game = props.game

    form.gameId = readResourceGameId(game) ?? ''
    form.trackerUrl = game?.trackerUrl ?? ''
    form.isRecruitable = Boolean(game?.isRecruitable)
    form.isFavoriteGame = Boolean(game?.isFavoriteGame)
    form.platformIds = readIdsFromPlayerGame(game, 'platformIds', 'rscGamePlatforms')
    form.positionIds = readIdsFromPlayerGame(game, 'positionIds', 'rscGamePositions')
    form.characterIds = readIdsFromPlayerGame(game, 'characterIds', 'rscGameCharacters')
    form.modeRanks = hydrateModeRanks(game)
    form.username = readAccountValue(game, 'username')
    form.tagLine = readAccountValue(game, 'tagLine')
    form.battleTag = readAccountValue(game, 'battleTag')
    form.region = readAccountValue(game, 'region')
    form.puuid = readAccountValue(game, 'puuid')
    ensureModeRankRows()
  } finally {
    isHydratingForm = false
  }
}

const addModeRank = () => {
  if (!canAddModeRank.value) return
  form.modeRanks = [...form.modeRanks, createModeRankRow()]
}

const removeModeRank = (index: number) => {
  form.modeRanks = form.modeRanks.filter((_, currentIndex) => currentIndex !== index)
  ensureModeRankRows()
}

const closeModal = () => {
  modalStore.close(props.modalId)
}

const onSubmit = async () => {
  if (!validateForm()) return

  const payload = buildPayload()
  isSaving.value = true

  try {
    if (isEditMode.value && props.game) {
      const gameId = readPlayerGameId(props.game)
      if (gameId === null) throw new Error('game_id_missing')
      await props.updateGame(gameId, payload as UpdatePlayerGameDTO)
      toast.add({
        variant: 'success',
        title: 'Jeu modifie',
        desc: 'Le jeu a ete mis a jour.'
      })
    } else {
      await props.createGame(payload as CreatePlayerGameDTO)
      toast.add({
        variant: 'success',
        title: 'Jeu ajoute',
        desc: 'Le jeu a ete ajoute au profil.'
      })
    }

    closeModal()
  } catch (error: unknown) {
    toast.add({
      variant: 'error',
      title: 'Erreur',
      desc: error instanceof Error ? error.message : 'Impossible d enregistrer le jeu.'
    })
  } finally {
    isSaving.value = false
  }
}

watch(() => form.gameId, (nextValue, previousValue) => {
  if (isHydratingForm) return
  if (nextValue === previousValue) return
  clearErrors()
  resetGameSpecificFields()
}, { flush: 'sync' })

watch(showModeRanksField, () => {
  ensureModeRankRows()
})

watch(() => props.game, () => {
  hydrateForm()
}, { immediate: true })

onMounted(() => {
  void resourcesStore.bootstrap()
})
</script>

<style scoped>
.profile-game-modal {
  --profile-game-modal-grid-column-min: calc(var(--unit) * 47);
  display: grid;
  gap: var(--space-2);
}

.profile-game-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.profile-game-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.profile-game-modal__section-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
}

.profile-game-modal__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--profile-game-modal-grid-column-min)), 1fr));
  gap: var(--space-2);
}

.profile-game-modal__empty,
.profile-game-modal__error {
  margin: 0;
  padding: var(--space-2);
  border: var(--border) solid color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  border-radius: var(--radius);
  background-color: color-mix(in oklch, var(--color-bg-soft) 72%, var(--color-transparent));
  color: var(--color-muted);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.profile-game-modal__error {
  border-color: color-mix(in oklch, var(--color-accent) 54%, var(--color-line));
  color: var(--color-text);
}

.profile-game-modal__mode-list {
  display: grid;
  gap: var(--space-2);
}

.profile-game-modal__mode-card {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-2);
  border: var(--border) solid color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  border-radius: var(--radius);
  background-color: color-mix(in oklch, var(--color-bg-soft) 72%, var(--color-transparent));
}

.profile-game-modal__mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.profile-game-modal__icon-button {
  display: inline-flex;
  width: var(--app-header-hit-size);
  height: var(--app-header-hit-size);
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border) solid color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  border-radius: var(--radius);
  background-color: color-mix(in oklch, var(--color-bg-soft-hover) 76%, var(--color-transparent));
  color: var(--color-text);
  cursor: pointer;
  transition-duration: var(--motion-fast);
}

.profile-game-modal__icon-button:hover {
  border-color: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  background-color: color-mix(in oklch, var(--color-bg-soft-hover) 86%, var(--color-accent));
}

.profile-game-modal__icon-button:disabled {
  color: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  cursor: not-allowed;
}

.profile-game-modal__icon-button svg {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
}
</style>
