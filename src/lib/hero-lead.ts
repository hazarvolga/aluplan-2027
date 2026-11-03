/** Hero lead without the page title that the source description repeats as its first words ("Başlık: açıklama"). */
export function heroLead(title: string, description: string): string {
  const prefix = `${title.trim()}:`;
  if (!description.toLocaleLowerCase('tr').startsWith(prefix.toLocaleLowerCase('tr'))) return description;
  const rest = description.slice(prefix.length).trim();
  return rest || description;
}
