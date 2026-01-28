import type { ActionContext } from 'vuex'
import type { Horse, HorsesState, RootState } from '@/shared/types'
import { HORSE_NAMES, HORSE_COLORS } from '@/shared/config'
import { generateCondition } from '@/shared/lib'

type HorsesContext = ActionContext<HorsesState, RootState>

const generateHorsesList = (): Horse[] => {
  return HORSE_NAMES.map((name, index) => ({
    id: index + 1,
    name,
    color: HORSE_COLORS[index],
    condition: generateCondition(),
  }))
}

export const state = (): HorsesState => ({
  horses: [],
  isGenerated: false,
})

export const getters = {
  allHorses: (state: HorsesState): Horse[] => state.horses,

  getHorseById: (state: HorsesState) => (id: number): Horse | undefined => {
    return state.horses.find((horse) => horse.id === id)
  },

  isHorsesGenerated: (state: HorsesState): boolean => state.isGenerated,

  horseCount: (state: HorsesState): number => state.horses.length,
}

export const mutations = {
  SET_HORSES(state: HorsesState, horses: Horse[]): void {
    state.horses = horses
    state.isGenerated = true
  },

  RESET_HORSES(state: HorsesState): void {
    state.horses = []
    state.isGenerated = false
  },

  UPDATE_HORSE_CONDITION(state: HorsesState, payload: { id: number; condition: number }): void {
    const horse = state.horses.find((h) => h.id === payload.id)
    if (horse) {
      horse.condition = payload.condition
    }
  },
}

export const actions = {
  generateHorses({ commit }: HorsesContext): Horse[] {
    const horses = generateHorsesList()
    commit('SET_HORSES', horses)
    return horses
  },

  resetHorses({ commit }: HorsesContext): void {
    commit('RESET_HORSES')
  },

  regenerateConditions({ commit, state }: HorsesContext): void {
    state.horses.forEach((horse) => {
      commit('UPDATE_HORSE_CONDITION', {
        id: horse.id,
        condition: generateCondition(),
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
