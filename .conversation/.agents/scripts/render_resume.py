import fitz
from pathlib import Path
pdf = Path('attached_assets/Ayush_Mishra_Resume_1789313692711.pdf')
out = Path('.agents/outputs/resume_pages')
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    path = out / f'page-{i+1}.png'
    pix.save(path)
    print(path)
