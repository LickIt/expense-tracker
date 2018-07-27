from flask import Response, jsonify


class ApiException(Exception):
    def __init__(self, message, status_code=400, payload=None):
        Exception.__init__(self)
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def api_error_handler(error: ApiException) -> Response:
    response: Response = jsonify(error.to_dict())
    response.status_code = error.status_code

    return response
