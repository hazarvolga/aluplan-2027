export const expiringExample = 'ALLPLAN Worgroup Manager (bağımsız), ALLPLAN Share (bağımsız), ALLPLAN Exchange (bağımsız), Frilo ESK, ESK-RS, TRK, LAST, WS, DLT, ELI, B5, B7, B8, B9, B10, SL4, BHA, D8, Dach (D9, D11, D12, DGK) FWT, HO6, HO7, HO9, HO10, HO12, BTII, SL3, ST7, ST8, ST10, ST12, ST13, ST14, BBR, TEB-1, TWB';
export const friloEnded = 'Frilo D7, D10, HO1, HO2, HO5, HO11, S7, S9, ST1, ST2, STX, MW, SPU, TGL, TRA';
export const friloOctober2025 = 'Frilo ESK, ESK-RS, TRK, LAST, WS, DLT, ELI, B5, B7, B8, B9, B10, SL4, BHA, D8, Dach (D9, D11, D12, DGK) FWT, HO6, HO7, HO9, HO10, HO12, BTII, SL3, ST7, ST8, ST10, ST12, ST13, ST14, BBR, TEB-1, V1, Q3, TWB';
export const maintenanceServices = [
  ['Yeni özellikler', true, false, false], ['İyileştirmeler', true, false, false], ['Bakım düzeltmeleri*', true, true, false], ['Yeni ortamların sertifikasyonu', true, false, false], ['Masaüstünden ALLPLAN Cloud’a bağlantılar (doğrudan arayüz) (yalnızca ALLPLAN, SDS2 ve SCIA ENG için)', true, true, false],
] as const;
export const supportServices = [
  ['Destek kaynakları (çevrimiçi)', true, true, false], ['Eğitim materyalleri (çevrimiçi)', true, true, false], ['Olay bildirimi (telefon, e-posta veya destek talebi)', true, true, false], ['Servis talepleri (abonelik ve SSA kapsamında sunulur; desteklenen sürümler için düşük önceliklidir)', true, true, false], ['İndirmeler', true, true, false],
] as const;
