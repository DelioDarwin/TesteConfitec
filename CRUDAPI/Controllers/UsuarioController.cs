using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CRUDAPI.Models;
using Google.Protobuf.WellKnownTypes;
using IronPdf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CRUDAPI.Controllers {
    [ApiController]
    [Route ("api/[controller]")]
    public class UsuarioController : ControllerBase {
        private readonly Contexto _contexto;

        public UsuarioController (Contexto contexto) {
            _contexto = contexto;
        }

        [HttpGet]
        public async Task<ActionResult<IList<Usuario>>>  PegarTodosAsync () {
            var retorno = await _contexto.Usuarios.Include(t => t.HistoricoEscolar).ToListAsync();
            return retorno;
        }

        [HttpGet ("{Id}")]
        public async Task<ActionResult<Usuario>> PegarAlunoPeloIdAsync (int Id) {
            var retorno = await _contexto.Usuarios.Include(t => t.HistoricoEscolar).FirstOrDefaultAsync(i => i.Id == Id);

            if (retorno == null)
                return NotFound ();

            return retorno;
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> SalvarAlunoAsync (Usuario usuario) {
            await _contexto.Usuarios.AddAsync(usuario);
            await _contexto.SaveChangesAsync ();

            return Ok ();
        }

       [HttpPut]
        public async Task<ActionResult> AtualizarAlunoAsync (Usuario usuario) {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync ();

            return Ok ();
        }

        [HttpDelete ("{Id}")]
        public async Task<ActionResult> ExcluirAlunoAsync(int Id) {
            Usuario Usuario = await _contexto.Usuarios.FindAsync(Id);
            HistoricoEscolar Historico = await _contexto.HistoricosEscolares.FindAsync(Usuario.HistoricoEscolarId);

            if (Usuario == null)
                return NotFound ();

            if (Historico == null)
                return NotFound ();

            _contexto.Remove(Usuario);
            await _contexto.SaveChangesAsync ();

             _contexto.Remove(Historico);
            await _contexto.SaveChangesAsync ();

            return Ok ();
        }

        [HttpPost]
		[Route("GerarPDF/{Id}")]
		public async Task<IActionResult> GerarPDF(int Id)
		{
           HistoricoEscolar hist = await _contexto.HistoricosEscolares.FindAsync(Id);

            if (hist == null)
                return NotFound ();  

			string PDFfilename = DateTime.Now.Ticks.ToString() + ".pdf";
			var Renderer = new ChromePdfRenderer(); 
            string urlImg = "<img src='./Generatedpdffiles/logoConfitec.jpg'>";

            string html = urlImg;
            html += "<h4>" + hist.Titulo + "</h4>";
            html += "<br><br>";
            html += hist.Conteudo;

			var pdf = Renderer.RenderHtmlAsPdf(html);

			pdf.SaveAs(Path.Combine(Directory.GetCurrentDirectory(), "Generatedpdffiles", PDFfilename));

			return await DownloadFile(PDFfilename);
		}


		private async Task<IActionResult> DownloadFile(string filename)
		{
			var Downloadfilepath = Path.Combine(Directory.GetCurrentDirectory(), "Generatedpdffiles", filename);

			var provider = new FileExtensionContentTypeProvider();
			if (!provider.TryGetContentType(Downloadfilepath, out var contenttype))
			{
				contenttype = "application/octet-stream";
			}

			var bytes = await System.IO.File.ReadAllBytesAsync(Downloadfilepath);
			return File(bytes, contenttype, Path.GetFileName(Downloadfilepath));
		}
    }
}