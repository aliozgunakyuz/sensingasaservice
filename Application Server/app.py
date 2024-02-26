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


class Model_Data(BaseModel):
    model_name: str
    value: Dict[AnyStr, Any]

_applet_folder = "/applets"
_sensor_folder = "/data"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.get('/get_inference/{applet_id}')
async def execute_api(applet_id: Annotated[str, Form()], data: List[Model_Data] = Form(...), sensor_data: Optional[Annotated[UploadFile, File()]] = Form(None)):

    codelet = get_codelet(applet_id)

    codelet_input = data

    if sensor_data is not None:
        filepath = os.path.join(_sensor_folder, sensor_data.filename)
        async with aiofiles.open(filepath, 'wb') as out_file:
            while content := await sensor_data.read(1024):  # async read chunk
                await out_file.write(content)

        codelet_input.update({'sensor_file': filepath})

    codelet_result = codelet.execute(**codelet_input)

    return Response(codelet_result)


@app.post('/deployapi')
async def deploy_applet(in_file: Annotated[UploadFile, File()], dependencies: List[str]=Form(...)):
    applet_id = str(uuid.uuid4())

    filepath = os.path.join(_applet_folder, f'{applet_id}.py')
    async with aiofiles.open(filepath, 'wb') as out_file:
        while content := await in_file.read(1024):  # async read chunk
            await out_file.write(content)

    if(len(dependencies)):
        dep = dependencies.join(' ')
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
