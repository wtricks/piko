<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useIssueStore, type IssueType } from '@/stores/issue'

const toast = useToast()
const issueStore = useIssueStore()

const previewOptions = [
  { label: 'Preview on Device', icon: 'i-lucide-smartphone' },
  { label: 'Preview on Web', icon: 'i-lucide-monitor' },
]

const devOptions = [
  { label: 'View Code', icon: 'i-lucide-code' },
  { label: 'Project Settings', icon: 'i-lucide-sliders' },
  { label: 'Download Project', icon: 'i-lucide-download' },
  { label: 'Connect to GitHub', icon: 'i-lucide-github' },
]

const issuesOptions = [
  { label: 'All', slot: 'all', value: 'all' },
  { label: 'Errors', slot: 'error', value: 'error' },
  { label: 'Warnings', slot: 'warning', value: 'warning' },
]

const activeIssueTab = ref<IssueType>('all')
const filteredIssues = computed(() => issueStore.filteredIssues(activeIssueTab.value))

const isPrivate = ref(true)
const shareLink = ref('https://yourapp.com/project/12345')
const { copy: copyToClipboard } = useClipboard()

const copyLink = () => {
  copyToClipboard(shareLink.value)
  toast.add({
    title: 'Link Copied',
    description: 'The share link has been copied to your clipboard.',
    color: 'success',
    duration: 3000,
  })
}
</script>

<template>
  <div class="flex items-center space-x-5">
    <div class="flex items-center space-x-2">
      <UPopover>
        <UTooltip text="Version Control">
          <UButton variant="soft" color="neutral" icon="i-lucide-git-fork" />
        </UTooltip>

        <template #content>
          <div class="w-80 space-y-2 p-3">
            <h3 class="font-semibold text-default text-base">Project Version Control</h3>
            <p class="text-sm text-toned">
              Manage your project's version control settings and view recent commits.
            </p>
          </div>
        </template>
      </UPopover>
      <UPopover>
        <UTooltip text="Errors & Warnings">
          <div>
            <UChip show color="warning" size="3xl" :text="issueStore.issues.length">
              <UButton variant="soft" color="neutral" icon="i-tabler-bug" />
            </UChip>
          </div>
        </UTooltip>

        <template #content>
          <div class="flex flex-col px-3 py-2 w-96">
            <h3 class="font-semibold text-default text-base mb-3">Errors & Warnings</h3>
            <UTabs v-model="activeIssueTab" :items="issuesOptions" size="sm">
              <template #[activeIssueTab]>
                <div
                  v-if="filteredIssues.length"
                  class="max-h-60 overflow-y-auto space-y-2 scrollbar"
                >
                  <div
                    v-for="(issue, index) in filteredIssues"
                    :key="index"
                    class="p-2 border border-accented rounded"
                  >
                    <div class="flex items-start gap-2">
                      <div>
                        <UIcon
                          :name="
                            issue.type === 'error'
                              ? 'i-lucide-alert-circle'
                              : 'i-lucide-alert-triangle'
                          "
                          :class="
                            issue.type === 'error' ? 'text-error-500 size-5' : 'text-warning size-5'
                          "
                        />
                      </div>
                      <div>
                        <p class="text-sm text-default">{{ issue.message }}</p>
                        <span class="text-xs text-muted">{{ issue.timestamp }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-toned font-semibold text-center py-10">
                  No issues found. Great job!
                </div>
              </template>
            </UTabs>
          </div>
        </template>
      </UPopover>
      <UDropdownMenu
        :items="devOptions"
        :content="{
          align: 'start',
          side: 'bottom',
          sideOffset: 4,
        }"
        :ui="{
          content: 'w-48',
          itemLeadingIcon: 'size-4 mr-1',
          item: 'py-2.5 border-b border-accented last:border-none',
          itemLabel: 'font-medium',
        }"
      >
        <UTooltip text="Devloper Options">
          <UButton variant="soft" color="neutral" icon="i-solar-code-bold" />
        </UTooltip>
      </UDropdownMenu>
    </div>
    <div class="flex items-center space-x-2 pr-4">
      <UPopover>
        <UTooltip text="Share">
          <UButton variant="soft" color="neutral" icon="i-humbleicons-share" />
        </UTooltip>

        <template #content>
          <div class="w-80 space-y-4 p-3">
            <div>
              <h3 class="font-semibold text-default">Share this project</h3>
              <p class="text-sm mt-1 text-toned">
                Copy and share this link with your team members or collaborators.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UInput v-model="shareLink" readonly class="w-full" size="md" />
              <UButton variant="outline" @click="copyLink" title="Copy Link" size="lg">
                <UIcon name="i-lucide-copy" class="size-4" />
              </UButton>
            </div>

            <p class="text-xs text-muted">
              This link is private by default. You can make it public if you want anyone with the
              link to access it.
            </p>

            <div class="flex justify-center">
              <UButton
                @click="isPrivate = !isPrivate"
                :icon="isPrivate ? 'i-lucide-lock-open' : 'i-lucide-lock'"
                label="Make Public"
                variant="outline"
                color="neutral"
                class="w-full flex justify-center"
              />
            </div>
          </div>
        </template>
      </UPopover>

      <UDropdownMenu
        :items="previewOptions"
        :content="{
          align: 'start',
          side: 'bottom',
          sideOffset: 4,
        }"
        :ui="{
          content: 'w-48',
          itemLeadingIcon: 'size-4 mr-1',
          item: 'py-2.5 border-b border-accented last:border-none',
          itemLabel: 'font-medium',
        }"
      >
        <UTooltip text="Preview">
          <UButton variant="soft" color="primary" icon="i-fluent-play-32-filled" />
        </UTooltip>
      </UDropdownMenu>
    </div>
  </div>
</template>
