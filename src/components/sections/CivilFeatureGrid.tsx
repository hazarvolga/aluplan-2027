'use client';

import { useState } from 'react';
import { features, options, clouds } from '@/data/allplan-civil-2027-preview';
import { MediaDialog } from '@/components/ui/MediaDialog';
import { MediaGridSection } from './MediaGridSection';

export function CivilFeatureGrid({ variant = 'features' }: { variant?: 'features' | 'options' | 'clouds' }) {
  const [image, setImage] = useState<{ src: string; title: string } | null>(null);
  const [video, setVideo] = useState<{ youtubeId: string; title: string } | null>(null);
  const images = ['Parametric_Modeling.jpg','Parametric_Prestresing.jpg','Bridge_Structural_Analysis.jpg','Bridge_Code_Based_design.jpg','01_Interfaces_2.jpg','02_EXTERNAL_DATA_SOURCES_Graphic_2.jpg','03_3D_Modeling_2.jpg','04_2D_DRAFTING_2.jpg','Visualization__basic__Conc___Prof___Ulti_.jpg','ALLPLAN_Advanced_Visualization_Redshift_Renderer_700x400.jpg','06_CLASH_DETECTION_2.jpg','07_CONTENT_PACKAGE_BIM_EASY_Klein_2.jpg','08_BUILDING_COMPONENTS_2.jpg','09_Terrain_Model_2.jpg','10_Urban_and_Landscape_Design_2.jpg','11_Sewerage_and_Utilities_2.jpg','12_QUANTITY_TAKE-OFF_AND_COSTING_3.jpg','13_REINFORCEMENT_4.jpg','14_STEEL_CONNECTIONS_2.jpg','15_ROADS_2.jpg','16_CONSTRUCTION_SITE_PREPARATION_2.jpg','17_Groundworks_2.jpg','17_EXCAVATION_2.jpg','18_Precast_Design_and_Detailing_2.jpg','19_Element_Plan_2.jpg','csm_1.WEB_NEW-Automatic_Parametric_Axis_Grid_-_Kopie_ea43deb285.png','csm_2.WEB_NEW-Arrange_stations_-_Kopie_d609a21dc0.png','csm_3.WEB_NEW-Reusable_Serial_Elements_-_Kopie_9b200303b8.png'];
  const optionImages = ['30_BIM2FORM_ADD_ON_-_FORMWORK_2.jpg','License_Server_Filter_01.jpg','23_BIMPLUS_PRO_2.jpg','ALLPLAN_CLOUD_STORAGE_Filter_01.jpg'];
  const cloudImages = ['14_CLOUD-BASED_COLLABORATION_2.jpg','15_PROJECT_TEAMWORKING_2_01.jpg','16_DRAWING_AND_PLAN_DISTRIBUTION_2.jpg','17_ANALYTICAL_MODEL_GENERATION_2.jpg','Allplan-WorkgroupManager.jpg','CLOUD-ENABLED_PROJECT_RESOURCES_Filter_01.jpg','ALLPLAN_Model_Viewer_700x400.jpg','ALLPLAN_BLUEBEAM_Connection_700x400_01.jpg','AI_Based_Viz.jpg'];
  const isOptions = variant === 'options';
  const isClouds = variant === 'clouds';
  const items = isOptions ? options : isClouds ? clouds : features;
  const selectedImages = isOptions ? optionImages : isClouds ? cloudImages : images;
  return <>
    <MediaGridSection grid={{ title: isOptions ? 'Satın alınabilir seçenekler' : isClouds ? 'ALLPLAN Cloud Services' : 'ALLPLAN Civil özellikleri', subtitle: isOptions || isClouds ? undefined : 'İşlevlere genel bakış', columns: 4, items: items.map(([title, description, youtubeId], index) => ({ title, description, youtubeId, imageSrc: `/assets/previews/allplan-civil-2027/features/${selectedImages[index]}` })) }} itemKeyPrefix={isOptions ? "civil-option" : isClouds ? "civil-cloud" : "civil-feature"} onVideo={setVideo} onImage={setImage} />
    {image && <MediaDialog label={`${image.title} görseli`} onClose={() => setImage(null)}><div className="alu-video-modal__dialog alu-video-modal__dialog--image"><div className="alu-video-modal__header"><h3 className="alu-video-modal__title">{image.title}</h3><button type="button" className="alu-video-modal__close" data-media-dialog-close aria-label="Görseli kapat" onClick={() => setImage(null)}>✕</button></div><div className="alu-video-modal__image-viewport"><img src={image.src} alt={image.title} /></div></div></MediaDialog>}
    {video && <MediaDialog label={`${video.title} videosu`} onClose={() => setVideo(null)}>
      <div className="alu-video-modal__dialog"><div className="alu-video-modal__header"><h3 className="alu-video-modal__title">{video.title}</h3><button type="button" className="alu-video-modal__close" data-media-dialog-close aria-label="Videoyu kapat" onClick={() => setVideo(null)}>✕</button></div><div className="alu-video-modal__viewport"><iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`} title={`${video.title} videosu`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div>
    </MediaDialog>}
  </>;
}
