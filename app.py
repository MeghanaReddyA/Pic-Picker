from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_updated_date():
    #Fetch data from Excel file and return as JSON.
    file_path = 'data.xlsx'

    # Return error if Excel file is missing
    if not os.path.exists(file_path):
        return jsonify({'error':'file not found'}), 404
    
    # Read Excel, replace NaN with empty string, convert to dict
    df = pd.read_excel(file_path, index_col=None)
    df = df.fillna('')
    data_dict = df.to_dict(orient='list')
    
    return jsonify(data_dict)

if __name__ == '__main__':
    # Disable caching and run in debug mode for development
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)