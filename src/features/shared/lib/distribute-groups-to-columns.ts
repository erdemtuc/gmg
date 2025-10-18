export function distributeGroupsToColumns<T extends { fields: Array<unknown> }>(
  fieldGroups: T[],
  detailColumnsCount: number,
): T[][] {
  if (!fieldGroups || fieldGroups.length === 0) {
    return [];
  }

  const columns: T[][] = Array.from({ length: detailColumnsCount }, () => []);

  // Compute heights for each group: 1 for title + number of fields
  const groupHeights = fieldGroups.map((g) => 1 + Object.keys(g.fields).length);
  const maxHeight = Math.max(...groupHeights);
  const totalHeight = groupHeights.reduce((sum, h) => sum + h, 0);
  const targetPerColumn = Math.ceil(totalHeight / detailColumnsCount);
  const cuttingOffHeight = Math.max(targetPerColumn, maxHeight);

  let currentColumnIndex = 0;
  let currentHeight = 0;

  for (let i = 0; i < fieldGroups.length; i++) {
    const group = fieldGroups[i];
    const height = groupHeights[i];

    // If adding this group would exceed the target and we still have columns left,
    // move to the next column (but ensure each column has at least one group).
    if (
      currentColumnIndex < detailColumnsCount - 1 &&
      columns[currentColumnIndex].length > 0 &&
      currentHeight + height > cuttingOffHeight
    ) {
      currentColumnIndex += 1;
      currentHeight = 0;
    }

    columns[currentColumnIndex].push(group);
    currentHeight += height;
  }

  return columns;
}
