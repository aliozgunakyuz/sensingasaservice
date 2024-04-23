import importlib.util
import aiofiles
import os
from subprocess import Popen

import uuid

from typing import Optional, List, Dict, AnyStr, Any

from fastapi import FastAPI, Response
from fastapi import Form, File, UploadFile

from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.logger import logger

from typing_extensions import Annotated

from pydantic import BaseModel
import uvicorn


class ModelData(BaseModel):
    name: str  
    value: Dict[AnyStr, Any]

class DetectionValue(BaseModel):
    bbox: List[int]
    class_name: str
    confidence: float

class Detection(BaseModel):
    name: str
    value: DetectionValue

class InferenceRequest(BaseModel):
    data: List[Detection]


_applet_folder = "/applets"
_sensor_folder = "/data"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_codelet(applet_id):
    cfile = os.path.join(_applet_folder, f'{applet_id}.py')
    codelet_spec = importlib.util.spec_from_file_location("codelet", cfile)
    codelet = importlib.util.module_from_spec(codelet_spec)
    codelet_spec.loader.exec_module(codelet)
    return codelet


@app.post('/get_inference/{applet_id}')
async def execute_api(applet_id: str, inference_request: InferenceRequest):
    codelet = get_codelet(applet_id)
    codelet_input = {detection.name: detection.value.dict() for detection in inference_request.data}

    # Your logic here, assuming execute method accepts **kwargs
    codelet_result = codelet.execute(**codelet_input)

    return codelet_result



@app.post('/deployapi')
async def deploy_applet(in_file: Annotated[UploadFile, File()], dependencies: List[str]=Form(...)):
    applet_id = str(uuid.uuid4())

    filepath = os.path.join(_applet_folder, f'{applet_id}.py')
    async with aiofiles.open(filepath, 'wb') as out_file:
        while content := await in_file.read(1024):  # async read chunk
            await out_file.write(content)

    if(len(dependencies)):
        dep = ' '.join(dependencies)
        Popen(['python', '-m', 'pip', 'install', dep])

    return {
        'applet_id': applet_id
    }

@app.get('/deleteapi/{applet_id}')
async def delete_applet(applet_id: str):
    filepath = os.path.join(_applet_folder, f'{applet_id}.py')
    if os.path.isfile(filepath):
        os.remove(filepath)
        return {'status' : 'OK'}

    return JSONResponse(status_code=500, content = {'status': 'Failure. No api found'})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5003)