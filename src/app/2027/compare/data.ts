type State = 'included' | 'none' | 'optional';
type Row = { name: string; values: [State, State, State, State] };
const all: Row['values'] = ['included','included','included','included'];
const concept: Row['values'] = ['none','included','included','included'];
const professional: Row['values'] = ['none','none','included','included'];
const ultimate: Row['values'] = ['none','none','none','included'];
const option: Row['values'] = ['optional','optional','optional','optional'];
const rows = (names: string[], values: Row['values']): Row[] => names.map(name => ({name, values}));
export const groups = [
 {title:'Özellikler', rows:[
 ...rows(['Arayüzler','3B modelleme','2B çizim','Çakışma kontrolü','BIM Easy içerik paketi','Görselleştirme'], all),
 ...rows(['Harici veri kaynakları','Yapı bileşenleri','Bilgi modelleme ve yönetimi','Arazi modeli','Kentsel tasarım ve peyzaj tasarımı','Kanalizasyon ve altyapı hatları','Metraj ve maliyet hesabı'], concept),
 ...rows(['Gelişmiş görselleştirme','Gelişmiş bilgi modelleme ve yönetimi','Donatı','Çelik birleşimler','Yollar','Şantiye hazırlığı'], professional),
 ...rows(['Zemin işleri','Kazı','Prekast tasarımı ve detaylandırması','Eleman planı','Parametrik modelleme','Parametrik öngerme'], ultimate),
 ...rows(['İngilizce, yerel dil ve ülke ayarları'],all), ...rows(['Diğer tüm diller ve ülke ayarları'],ultimate)
 ]},
 {title:'ALLPLAN Max',rows:rows(['AI BIM Analyst','AI Feature Builder (MCP)','AI Workflow Builder (MCP)','AI BIM Modeler','AI Formula Writer','AI Coach','AI Drafter','AI Visualizer'],all)},
 {title:'ALLPLAN Cloud Services**',rows:[...rows(['Bulut tabanlı iş birliği','Proje ekip çalışması','Çizim ve pafta dağıtımı','Analitik model oluşturma','ALLPLAN Model Viewer***','ALLPLAN – Bluebeam bağlantısı','Ofis ekip çalışması','Bulut destekli proje kaynakları'],all),{name:'Yapay zekâ destekli görselleştirme',values:['none','none','included','included'] as Row['values']}]},
 {title:'Satın alınabilir seçenekler',rows:[...rows(['Bimplus Pro','ALLPLAN Cloud Storage (100 GB)','Lisans sunucusu'],option),{name:'BIM²form eklentisi – kalıp',values:['none','none','none','optional'] as Row['values']}]}
];
