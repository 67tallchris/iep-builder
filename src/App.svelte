<script>
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import NoPiiBanner from './components/NoPiiBanner.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import CompliancePanel from './components/CompliancePanel.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import ShareModal from './components/ShareModal.svelte';
  import ShareView from './components/ShareView.svelte';
  import ProfileSection from './components/sections/ProfileSection.svelte';
  import PlaafpSection from './components/sections/PlaafpSection.svelte';
  import GoalsSection from './components/sections/GoalsSection.svelte';
  import ServicesSection from './components/sections/ServicesSection.svelte';
  import SupportsSection from './components/sections/SupportsSection.svelte';
  import BehaviorSection from './components/sections/BehaviorSection.svelte';
  import ReviewSection from './components/sections/ReviewSection.svelte';
  import { draft, replaceDraft, resetDraft, updateDraft as mutate } from './lib/store.js';
  import { runChecks } from './lib/compliance.js';
  import { fetchCatalog, fetchSnippets, saveDraft, updateDraft as apiUpdateDraft } from './lib/api.js';
  import { exemplarToDraft } from './lib/exemplar.js';
  import { exportDocx } from './lib/docx.js';

  const shareMatch = location.pathname.match(/^\/share\/([a-zA-Z0-9-]+)/);
  const shareId = shareMatch ? shareMatch[1] : null;

  let examples = [];
  let snippets = [];
  let dataError = '';
  let status = '';
  let settingsOpen = false;
  let shareOpen = false;
  let saving = false;
  let leftOpen = true;
  let rightOpen = true;
  let fileInput;

  $: checks = runChecks($draft);
  $: cloudLabel = $draft.cloud
    ? ($draft.cloud.shared ? 'Shared' : 'Cloud saved')
    : 'Local only';

  onMount(async () => {
    try {
      const [ex, sn] = await Promise.all([fetchCatalog(), fetchSnippets()]);
      examples = ex.examples || ex || [];
      snippets = sn.snippets || sn || [];
    } catch {
      try {
        const [ex, sn] = await Promise.all([
          fetch('/data/examples.json').then((r) => r.json()),
          fetch('/data/snippets.json').then((r) => r.json())
        ]);
        examples = ex.examples || ex || [];
        snippets = sn.snippets || sn || [];
      } catch {
        dataError = 'Could not load exemplar and snippet data. Run npm run data before building.';
      }
    }
  });

  function toast(msg) {
    status = msg;
    setTimeout(() => (status = ''), 2600);
  }

  function useExemplar(e) {
    replaceDraft(exemplarToDraft(e));
    toast('Exemplar loaded. Edit it for your student.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onNew() {
    if (confirm('Start a new draft? Your current local draft will be cleared (cloud copies are kept).')) {
      resetDraft();
      toast('New draft started.');
    }
  }

  async function saveCloud() {
    saving = true;
    try {
      if ($draft.cloud?.id) {
        await apiUpdateDraft($draft);
        toast('Cloud draft updated.');
      } else {
        const res = await saveDraft($draft);
        mutate((d) => {
          d.cloud = { id: res.id, editToken: res.editToken, shared: false };
        });
        toast('Saved to cloud.');
      }
    } catch (e) {
      toast('Save failed: ' + (e.message || e));
      throw e;
    } finally {
      saving = false;
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify($draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${($draft.title || 'iep-draft').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !parsed.profile) throw new Error('Not a valid draft file.');
        parsed.cloud = null;
        replaceDraft(parsed);
        toast('Draft imported.');
      } catch (e) {
        toast('Import failed: ' + e.message);
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }
</script>

{#if shareId}
  <ShareView id={shareId} />
{:else}
  <div class="app">
    <NoPiiBanner />
    <Header
      onNew={onNew}
      onSave={saveCloud}
      onShare={() => (shareOpen = true)}
      onExportDocx={() => exportDocx($draft)}
      onExportJson={exportJson}
      onImport={() => fileInput?.click()}
      onSettings={() => (settingsOpen = true)}
      onToggleLeft={() => (leftOpen = !leftOpen)}
      onToggleRight={() => (rightOpen = !rightOpen)}
      {saving}
      {cloudLabel}
    />
    <div class="app-main">
      {#if leftOpen}
        <Sidebar {examples} {snippets} onUseExemplar={useExemplar} />
      {/if}

      <main class="center">
        {#if dataError}
          <div class="card section"><p style="color:var(--fail)">{dataError}</p></div>
        {/if}
        <ProfileSection />
        <PlaafpSection />
        <GoalsSection />
        <ServicesSection />
        <SupportsSection />
        <BehaviorSection />
        <ReviewSection />
      </main>

      {#if rightOpen}
        <CompliancePanel {checks} />
      {/if}
    </div>
    <input
      type="file"
      accept="application/json,.json"
      bind:this={fileInput}
      on:change={importJson}
      style="display:none"
      aria-hidden="true"
      tabindex="-1"
    />
  </div>

  {#if settingsOpen}<SettingsModal onClose={() => (settingsOpen = false)} />{/if}
  {#if shareOpen}<ShareModal onClose={() => (shareOpen = false)} onSave={saveCloud} onToast={toast} />{/if}
  {#if status}<div class="toast" role="status">{status}</div>{/if}
{/if}
