from pathlib import Path
import re,json
base=Path('docs/00-inventory/interaction-source-evidence/components/homepage-v2')
def records(file,var):
 s=(base/file).read_text(); s=s.split('const '+var)[1].split('= [',1)[1].split('\n];',1)[0]
 result=[]
 for body in re.findall(r'\{(.*?)\n    \}',s,re.S):
  obj=dict(re.findall(r'(\w+): "([^"\n]*)"',body))
  for k,a in re.findall(r'(\w+): \[([^\]]+)\]',body): obj[k]=re.findall(r'"([^"]+)"',a)
  obj.pop('color',None)
  obj.pop('colSpan',None)
  result.append(obj)
 return result
D={'roles':records('PathwayProductSystem.tsx','roles'),'products':records('PathwayProductSystem.tsx','products'),'packages':records('TechSpecsTable.tsx','packages'),'solutions':records('BentoGrid.tsx','gridItems'),'innovations':records('InnovationsTeaser.tsx','features'),'services':records('ServicesV2.tsx','services')}
D['services'][0]['href']='/solutions-v2/training'
D['quickLinks']=[['Yenilikleri İncele','/products/allplan-2026-yenilikler'],['ALLPLAN 2026 İncele','/products/allplan-2026'],['ALLPLAN CLOUD VE Genel Geliştirmeler','/solutions/allplan-bulut-hizmetleri'],['ALLPLAN CLOUD Hizmetleri','/products/allplan-cloud-services'],['Eğitim Videoları','/solutions-v2/training/video-library']]
assert [len(D[x]) for x in ['roles','products','packages','solutions','innovations','services']]==[3,6,6,5,3,20]
Path('docs/previews/homepage-wireframe/data.js').write_text('window.previewData = '+json.dumps(D,ensure_ascii=False,indent=2)+';\n')
