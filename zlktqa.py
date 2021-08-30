#encoding: utf-8

from flask import Flask,render_template,request,redirect,url_for,session,jsonify
import config
from models import User,Qrcode,Question
from exts import db
from decorators import login_required
import os
from werkzeug.utils import secure_filename
from strUtil import Pic_str

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

FILE_EXTENSIONS = set(['txt', 'doc', 'pdf', 'zip', 'rar', 'wps'])
PIC_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'gif', 'GIF'])
VIDEO_EXTENSIONS = set(['wav', 'aif', 'au', 'mp3', 'ram', 'wma'])
fileaddress = ''
picaddress = ''
videoaddress = ''

@app.route('/')
def index():
    # context = {
    #     'questions': Question.query.order_by('-create_time').all()
    # }
    # return render_template('index.html',**context)
    return render_template('index.html')

@app.route('/login/',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        telephone = request.form.get('telephone')
        password = request.form.get('password')
        user = User.query.filter(User.telephone == telephone,User.password == password).first()
        if user:
            session['user_id'] = user.id
            #31天内都不需要登录
            session.permanent = True
            return redirect(url_for('index'))
        else:
            return u'手机号码或密码错误，请重新确认登录！'

@app.route('/regist/',methods=['GET','POST'])
def regist():
    if request.method == 'GET':
        return render_template('regist.html')
    else:
        telephone = request.form.get('telephone')
        username = request.form.get('username')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        #验证手机号码是否已经被注册
        user = User.query.filter(User.telephone == telephone).first()
        if user:
            return u'该手机号码已被注册，请更换手机号码！'
        else:
            if password1 != password2:
                return u'两次密码不相等，请核对后再填写！'
            else:
                user = User(telephone=telephone,username=username,password=password1)
                db.session.add(user)
                db.session.commit()
                return redirect(url_for('login'))
@app.route('/logout/')
def logout():
    # session.pop('user_id')
    # del session['user_id']
    session.clear()
    return redirect(url_for('login'))

# 上传文件、图片、视音频
def file_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in FILE_EXTENSIONS
def pic_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in PIC_EXTENSIONS
def video_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in VIDEO_EXTENSIONS

@app.route('/uploadfile',methods=['GET','POST'])
def uploadfile():
    global fileaddress
    if request.method == 'POST':
        # 上传文件
        f = request.files['formdata']
        #  f = request.files.get("file")
        #  print(f)
        basepath = os.path.dirname(__file__)
        # 修改文件名使其唯一
        if f and file_allowed_file(f.filename):
            fname = secure_filename(f.filename)
            ext = fname.rsplit('.', 1)[1]
            new_filename = Pic_str().create_uuid() + '.' + ext
            upload_path = os.path.join(basepath, 'static/uploads/file', new_filename)
            fileaddress = os.path.join('http://kdhly.ddns.net:5000/static/uploads/file', new_filename)
            f.save(upload_path)
            # return picaddress
            return jsonify({'result': fileaddress})
    return jsonify({'result': fileaddress})

@app.route('/uploadpic',methods=['GET','POST'])
def uploadpic():
    global picaddress
    if request.method == 'POST':
        # 上传图片
        f = request.files['formdata']
        #  f = request.files.get("file")
        #  print(f)
        basepath = os.path.dirname(__file__)
        # 修改文件名使其唯一
        if f and pic_allowed_file(f.filename):
            fname = secure_filename(f.filename)
            ext = fname.rsplit('.', 1)[1]
            new_filename = Pic_str().create_uuid() + '.' + ext
            upload_path = os.path.join(basepath, 'static/uploads/pic', new_filename)
            picaddress = os.path.join('http://kdhly.ddns.net:5000/static/uploads/pic', new_filename)
            f.save(upload_path)
            #return picaddress 
            return jsonify({'result':picaddress})
    return jsonify({'result':picaddress})

@app.route('/uploadvideo',methods=['GET','POST'])
def uploadvideo():
    global videoaddress
    if request.method == 'POST':
        # 上传文件
        f = request.files['formdata']
        #  f = request.files.get("file")
        #  print(f)
        basepath = os.path.dirname(__file__)
        # 修改文件名使其唯一
        if f and video_allowed_file(f.filename):
            fname = secure_filename(f.filename)
            ext = fname.rsplit('.', 1)[1]
            new_filename = Pic_str().create_uuid() + '.' + ext
            upload_path = os.path.join(basepath, 'static/uploads/video', new_filename)
            videoaddress = os.path.join('http://kdhly.ddns.net:5000/static/uploads/video', new_filename)
            f.save(upload_path)
            return jsonify({'result': videoaddress})
    return jsonify({'result': videoaddress})

@app.route('/download',methods=['POST'])
def download():
    base64 = request.form.get('content')
    name = request.form.get('name')
    qrcode = Qrcode(content=base64,name=name)
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    qrcode.author = user
    db.session.add(qrcode)
    db.session.commit()
    return jsonify({'result': base64})

@app.route('/design/')
@login_required
def design():
    return render_template('design.html')

@app.route('/readme/')
def readme():
    return render_template('readme.html')

@app.route('/template/',methods=['GET','POST'])
@login_required
def template():
    if request.method == 'GET':
        return render_template('template.html')
    else:
        pass

@app.route('/user/')
@login_required
def user():
    context = {
        'qrcodes': Qrcode.query.order_by('-create_time').all()
    }
    return render_template('user.html',**context)

@app.route('/modifypic',methods=['GET','POST'])
@login_required
def modifypic():
    if request.method == 'POST':
        # 上传文件
        f = request.files['formdata']
        print(f)
        name = request.form.get('picname')
        print(name)
        basepath = os.path.dirname(__file__)
        print(basepath)
        # 修改文件名使其唯一
        if f and pic_allowed_file(name):
            upload_path = os.path.join(basepath, 'static/uploads/pic', name)
            f.save(upload_path)
            return jsonify({'result': upload_path})
    return jsonify({'result': 'true'})

@app.route('/deletepic/',methods=['POST'])
@login_required
def deletepic():
    id = request.form.get('id')
    qrcode = Qrcode.query.filter(Qrcode.id == id).first()
    db.session.delete(qrcode)
    db.session.commit()
    return jsonify({'result': 'true'})

@app.context_processor
def my_context_processor():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.filter(User.id == user_id).first()
        if user:
            return {'user':user}
    return {}



if __name__ == '__main__':
    app.run()
