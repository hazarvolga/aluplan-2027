"""Turkish display text for the existing precast-girder bridge workflow."""

TITLES = [
    '1. AKSLARIN OLUŞTURULMASI',
    '2. ENKESİTİN TANIMLANMASI',
    '3. ŞABLONUN OLUŞTURULMASI',
    '4. ALTYAPININ OLUŞTURULMASI',
    '5. KİRİŞLERİN YERLEŞTİRİLMESİ',
    '6. TABLİYENİN OLUŞTURULMASI',
    '7. KİRİŞ ÜSTÜ DOLGUNUN OLUŞTURULMASI',
    '8. KÖPRÜ YAPISININ TAMAMLANMASI',
]

DESCRIPTIONS = [
    'Her köprü projesi bir veya daha fazla aksla başlar. Allplan Bridge ile mevcut bir projeden LandXML veri formatında aks verilerini aktarabilir veya aksları elle tanımlayabilirsiniz. Her iki durumda da güzergâh parametrik olarak kaydedilir.',
    'İstediğiniz enkesiti tanımlayabilir; geometrisini bağımlılıkları ve değişkenleriyle birlikte belirleyebilirsiniz. Bu parametrik enkesitler istenildiğinde düzenlenebilir, şablon olarak kaydedilebilir ve yeniden kullanılabilir.',
    'Köprü ayağı, temel ve prefabrik kirişlerin istenen geometrileri şablon olarak tanımlanabilir. Bunun için daha önce tanımlanan, sabit ve değişken parametreleri içeren enkesitler kullanılır. Şablon 3B modelde kullanıldığında hangi bölümlerin sabit kalacağını ve hangilerinin uyarlanacağını belirleyebilirsiniz.',
    'Altyapı, temelli veya temelsiz olarak bir ya da iki aksa göre tanımlanabilir; örneğin altta arazi aksı ve üstte yol aksı kullanılabilir. Tanımlama doğrudan veya şablonlarla yapılabilir.',
    'Tabliye geometrisini oluşturmak için Allplan Bridge’in mevcut iş akışı kullanılır: geometri aks boyunca ötelenerek oluşturulur. Varyasyonlar uygulanabilir; sınırlar kullanılarak veya PythonPart nesneleri yerleştirilerek enkesite ve dolayısıyla 3B modele tüm ayrıntılar eklenebilir.',
    'Tabliyeyi oluşturmak için geometriyi aks boyunca öteleyin. İstenen varyasyonlar uygulanabilir; sınırlar kullanılarak veya PythonPart nesneleri yerleştirilerek enkesite ve dolayısıyla 3B modele ayrıntılar eklenebilir.',
    'Prefabrik kirişli köprülerde kirişlerin şekli altyapının geometrisine, tabliyenin geometrisi ise aksa bağlıdır. Allplan Bridge’in 3B Boolean işlemleri, kiriş enkesitinde tanımlanan kiriş üstü dolgu (haunch) biçimini kullanarak kiriş ile tabliye arasındaki boşluğu otomatik olarak doldurur.',
    'Ana köprü elemanları tamamlandıktan sonra öngerme tendonları, diyaframlar, mesnetler ve diğer elemanlar modellenerek veya parametrik PythonPart nesneleri yerleştirilerek oluşturulabilir.',
]

INTRO = [
    'Prefabrik kirişlerin geometrisi, altyapının geometrisine ve kirişlerin aks boyunca konumuna bağlıdır. Allplan Bridge, prefabrik kirişli köprülerin tam geometrisini kolayca ve hızlı biçimde oluşturmak için ek bir modelleme yaklaşımı sunar.',
    'Parametrik 3B şablonlar modelleme sürecini daha da verimli hale getirir. Düz prefabrik kirişler gibi tekrarlanan köprü elemanları yalnızca bir kez tanımlanır ve gerektiği kadar parametrik olarak yerleştirilir.',
]


def translate_precast_bridge(page):
    """Translate known content while preserving structure, links, and media IDs."""
    layout = page['structuredLayout']
    original_intro = layout['intro']
    steps = layout['splitCallouts']
    mapping = {
        page['h1']: 'PREFABRİK KİRİŞLİ KÖPRÜLERİN MODELLENMESİ',
        'Modeling Of Precast Girder Bridges': 'Prefabrik Kirişli Köprülerin Modellenmesi',
        'SOLUTIONS': 'ÇÖZÜMLER',
        'BRIDGE ENGINEERING': 'KÖPRÜ MÜHENDİSLİĞİ',
        '/ BRIDGE ENGINEERING · PRECAST GIRDER WORKFLOW': '/ KÖPRÜ MÜHENDİSLİĞİ · PREFABRİK KİRİŞ İŞ AKIŞI',
        original_intro['title']: 'Allplan Bridge – Prefabrik kirişli köprüler için özel iş akışı',
        original_intro['bullets'][0]: INTRO[0],
        original_intro['bullets'][1]: INTRO[1],
        ' '.join(original_intro['bullets']): ' '.join(INTRO),
    }
    for index, step in enumerate(steps):
        mapping[step['kicker']] = f'ADIM {index + 1:02} · KÖPRÜ İŞ AKIŞI'
        mapping[step['title']] = TITLES[index]
        mapping[step['description']] = DESCRIPTIONS[index]

    def translate(value):
        if isinstance(value, str):
            return mapping.get(value, value)
        if isinstance(value, list):
            return [translate(item) for item in value]
        if isinstance(value, dict):
            return {key: translate(item) for key, item in value.items()}
        return value

    return translate(page)
