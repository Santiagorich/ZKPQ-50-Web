import flask
from flask import render_template, request, send_from_directory
import tabula
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET'])
def home():
    return send_from_directory('','index.html')


@app.route('/api/v1/resources/questions', methods=['GET'])
def getquestions():
    #questions = {}
    counter = 1
    text = ""
    with open('preguntas.txt', encoding='utf8') as file:
        for line in file:
            text += line.strip()+"\n"
            counter+=1
    return text

@app.route('/api/v1/resources/test', methods=['POST'])
def test():

    jsonr = request.get_json()
    results = ""
    sexo = int(jsonr['sexo'])
    edad = int(jsonr['edad'])
    v = set(map(int, jsonr['v'].split(".")))
    f = set(map(int, jsonr['f'].split(".")))


    df = tabula.read_pdf("baremos.pdf", pages='all', lattice=True)

    nanxv = [9,10,14,18,22,27,31,40,46]
    nanxf = [43]
    nansum = 0
    impssv = [6,13,17,24,26,30,34,39,42,49]
    impssf = []
    impsssum = 0
    actv = [1,5,12,25,29,36,41,48]
    actf = [16,21]
    actsum = 0
    syv = [8,23,38,47]
    syf = [4,15,20,28,33,45]
    sysum = 0
    aggv = [2,3,19,32,35,37,50]
    aggf = [7,11,44]
    aggsum = 0
    offset = 0

    if 18<= edad <=24:
        tablenumber=0
    elif 25<= edad <=30:
        tablenumber=1
    elif 31<= edad <=45:
        tablenumber=2
    elif 46<= edad <=60:
        tablenumber=3
    else:
        tablenumber=4
    if (int(sexo) == 1):
        offset = 5
        sexo = "hombres"
    elif (int(sexo) == 2):
        sexo = "mujeres"
    rowoffset = len(df[tablenumber])-4

    for verdadero in v:
        if (verdadero in nanxv):
            nansum+=1
        elif (verdadero in impssv):
            impsssum+=1
        elif (verdadero in actv):
            actsum+=1
        elif (verdadero in syv):
            sysum+=1
        elif (verdadero in aggv):
            aggsum+=1
    for falso in f:
        if (falso in nanxf):
            nansum+=1
        elif (falso in impssf):
            impsssum+=1
        elif (falso in actf):
            actsum+=1
        elif (falso in syf):
            sysum+=1
        elif (falso in aggf):
            aggsum+=1
    
    results += f'''
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Puntaje</th>
      <th scope="col">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="resultado">Neuroticismo ansiedad (N-Anx): {str(nansum)}</th>
      <td class="spec">El {df[tablenumber].loc[rowoffset - nansum][1 + offset].zfill(3)} de los {sexo} es menos ansioso que tu</td>
    </tr>
    <tr>
      <th scope="row" class="resultado">Impulsividad-Búsqueda de sensaciones (ImpSS): {str(impsssum)}</th>
      <td class="spec">El {df[tablenumber].loc[rowoffset - impsssum][2 + offset].zfill(3)} de los {sexo} es menos impulsivo que tu</td>
    </tr>
    <tr>
      <th scope="row" class="resultado">Actividad (Act): {str(actsum)}</th>
      <td class="spec">El {df[tablenumber].loc[rowoffset - impsssum][3 + offset].zfill(3)} de los {sexo} es menos activo que tu</td>
    </tr>
    <tr>
      <th scope="row" class="resultado">Sociabilidad (Sy): {str(sysum)}</th>
      <td class="spec">El {df[tablenumber].loc[rowoffset - impsssum][4 + offset].zfill(3)} de los {sexo} es menos sociable que tu</td>
    </tr>
    <tr>
      <th scope="row" class="resultado">Agresividad-Hostilidad (AggHost): {str(aggsum)}</th>
      <td class="spec">El {df[tablenumber].loc[rowoffset - impsssum][5 + offset].zfill(3)} de los {sexo} es menos agresivo que tu</td>
    </tr>
  </tbody>
</table>
    '''
    return results

CORS(app)
app.run(host='0.0.0.0', port=5000)