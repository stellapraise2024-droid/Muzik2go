// Phase 2 take management — keep-all, never overwrite.
// - listBySection(projectId, section): Take[] ordered oldest→newest (Take 1..N)
// - favorite(takeId, v): star persists, multiple favs allowed
// - selectBest(takeId): one isSelected per recording (Verse2/Chorus4/Bridge3 comp)
// - compare(aId, bId): side-by-side A/B player, loudness-normalized preview
// Colors: emerald selected, pink fav, purple AI note dot.
import type { Take, Section } from "@muzik2go/shared-types";

export const SECTIONS: Section[] = ["verse", "chorus", "bridge"];

export function sortTakes(takes: Take[]): Take[] {
  return [...takes].sort((a, b) => a.id.localeCompare(b.id));
}

export function bestPerSection(takes: Take[]): Take | undefined {
  return takes.find((t) => t.isSelected) ?? takes.find((t) => t.isFavorite) ?? takes[0];
}
