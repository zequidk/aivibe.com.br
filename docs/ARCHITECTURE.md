# Arquitetura e operação

O site da AIVIBE tem duas páginas estáticas em português do Brasil. A página institucional fica na raiz e a apresentação comercial do AIVIBE MENU em `/menu/`. As duas compartilham fontes, navegação e configuração de contatos.

## Arquivos públicos

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo das oito seções, header, footer, FAQ nativo, aviso de contato e metadados. |
| `menu/` | Página comercial de 13 seções, estilos do produto, controles das demonstrações e fotos locais em WebP. As três prévias conceituais abrem na própria página. |
| `css/style.css` | Paleta, tipografia, composição responsiva, foco e preferências de movimento. |
| `js/main.js` | Configuração comercial, links de contato, navegação, realce da seção atual e animações de entrada. |
| `assets/icons/` | Marca vetorial e símbolos de interface. |
| `assets/images/` | Ilustrações originais e imagem de compartilhamento em PNG de 1200 × 630 px. |
| `assets/fonts/` | Manrope e Inter variáveis no subconjunto latino, com as respectivas licenças OFL. |
| `robots.txt` | Diretivas para rastreadores. |

## Executar localmente

Na raiz do projeto, execute o comando abaixo. Python é usado apenas para servir a prévia.

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Abra a [página institucional](http://127.0.0.1:4174/) ou o [AIVIBE MENU](http://127.0.0.1:4174/menu/). Para encerrar o servidor iniciado no terminal, pressione Ctrl+C.

## Configurar o atendimento

Edite o objeto `SITE_CONFIG` no início de `js/main.js`.

| Campo | Como preencher |
| --- | --- |
| `whatsapp` | Número comercial completo com código do país e DDD. Espaços, parênteses, sinal de mais e hífens são aceitos. Confirme o destinatário no WhatsApp. |
| `messages` | Textos de contato do estúdio e mensagens distintas para a promoção do MENU, personalização e cada plano. |
| `menuUrl` | Substituição opcional por uma URL HTTPS externa. O card e o rodapé apontam por padrão para `menu/index.html` para permitir a navegação pelo disco e pelo servidor, inclusive com JavaScript desativado. |
| `contactLinks` | Lista de objetos com `label` e `url`. Os protocolos aceitos são HTTPS, `mailto:` e `tel:`. |
| `socialLinks` | Lista de objetos com `label` e a URL HTTPS do perfil oficial. |

Com o WhatsApp vazio ou em formato inválido, os CTAs exibem um aviso que também oferece os canais alternativos configurados. O botão flutuante é habilitado quando há um número em formato internacional.

## Publicar no aaPanel com OpenLiteSpeed

1. Confirme o domínio e sua forma canônica. Em cada página, defina `link rel="canonical"` e `og:url` com sua URL HTTPS e converta `og:image` para a URL absoluta da imagem correspondente.
2. Crie `sitemap.xml` com as duas URLs canônicas, da raiz e de `/menu/`. Use o namespace `http://www.sitemaps.org/schemas/sitemap/0.9` e acrescente a localização absoluta do sitemap a `robots.txt`.
3. No aaPanel, selecione o site do domínio aprovado e confira sua raiz pública. Copie `index.html`, `robots.txt`, `sitemap.xml` e as pastas `assets/`, `css/`, `js/` e `menu/`, preservando a estrutura. Os documentos de projeto ficam fora da raiz pública.
4. Defina `index.html` como índice e ative o certificado HTTPS do domínio. A aplicação usa arquivos estáticos e âncoras internas, dispensando instalação de pacotes, processo Node e regras de reescrita.
5. Abra a página pelo domínio final. Confira as fontes, imagens, metadados de compartilhamento, sitemap e uma conversão de cada serviço até a tela de conversa com o destinatário correto.
