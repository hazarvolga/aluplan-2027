type ChallengesBandProps = { title: string; items: readonly string[]; headingLevel?: 2 | 3 };
export function ChallengesBand({ title, items, headingLevel = 2 }: ChallengesBandProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return <div className="alu-challenges-band"><div className="alu-challenges-band__header"><span className="preview-kicker">/ SEKTÖREL ZORLUKLAR</span><Heading className="alu-h3" style={{margin:0}}>{title}</Heading></div><div className="alu-challenges-grid">{items.map((item,index)=><div className="alu-challenge-card" key={`${index}-${item}`}><span className="alu-challenge-card__num">{String(index+1).padStart(2,'0')}</span><p className="alu-body-sm" style={{margin:0}}>{item}</p></div>)}</div></div>;
}
