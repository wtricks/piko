import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { dummyIssues } from '@/components/data/issues'

export type IssueType = 'all' | 'error' | 'warning' | 'info'

export type Issue = {
  type: IssueType
  message: string
  timestamp: string
}

export const useIssueStore = defineStore('issue', () => {
  const issues = ref<Issue[]>(dummyIssues)

  const issueCount = computed(() => issues.value.length)
  const filteredIssues = (type: IssueType) => {
    if (type === 'all') {
      return issues.value
    }
    return issues.value.filter((issue) => issue.type === type)
  }

  return {
    issues,
    issueCount,
    filteredIssues,
  }
})
