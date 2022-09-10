const dotenv = require('dotenv');
dotenv.config(); // 비밀키 환경변수로 숨겨놓은거 불러오기 (.env)

const express = require('express');
const path = require('path'); // 경로 처리를 확실하게 할때 path모듈 사용!!
const morgan = require('morgan'); // 서버를 실행 할 때 콘솔에 요청 라우터 및 요청 포트번호를 알려줌 개발시 도움을 줌
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')) // 요청사항을 기록해서 알 수 있음 'combined' => 더 자세히 나옴 / 배포시 사용
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 사용
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET, // 키를 환경변수로 숨기는 방법 dotenv .env파일에 있음
    cookie : {
        httpOnly : true,
        secure : false,
    },
    name : 'session-cookie'
}));
//미들웨어 순서 중요함
//순서에 따라 쿠키나 세션 하고 스테틱이면 로그인한 사람에게만 이미지를 보여주겠다 같은 의미
app.use('/', express.static(path.join(__dirname, 'public'))); // public 폴더 안에 라우터가 아닌 파일(css, html 등)을 실행하고 싶을 때 사용
 
// bodyParser
// static은 next를 포함하고 있지 않은 미들웨어이기 때문에 위에 배치해야함 쿠키, 파싱, json등에 포함이 안되는데 맨 밑에 넣으면 쿠키, 파싱, json등 자원이 사용되기 때문에 자원을 낭비함
app.use(express.json()); // 클라이언트 json 파싱
app.use(express.urlencoded( { extended : true })); // 클라이언트 폼 파싱





app.use((req, res, next) => { // 모든 요청에 실행할 때 사용 => 미들웨어 : 요청과 응답 사이에 중간 역할을 통해 에러처리, 값 넣기 css파일 넣기 등이 가능하다
    console.log('모든 요청에 실행');
    next();
}, (req, res, next) =>{ // 하나의 함수에 여러 미들웨어를 쓸 수 있음 함수가 실행되면 안에 있는 미들웨어도 순차적으로 실행되지만 next('route')을 통해 아예 다음 함수로 넘어가갈 수 있음
    try{
        console.log(dasdasfa); //dasdasfa는 정의되어 있지 않음으로 모든 요청에 실행하는 첫 번째 미들웨에서 에러를 방생하면 밑에 에러처리 미들웨어로 간다
    } catch (error) { // 에러 처리하는 미들웨어로 넘겨줌 / next안에 매계변수를 넣는다
        next(error);
    }
}); 

app.get('/', (req, res) => { // get 요청을 http에서 if을 할 필요없이 깔금하게 가능
    req.cookies; //{mycookie : 'test} 형식으로
    // 'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    res.cookie('name', encodeURIComponent(name), {
        express : new Date(),
        httpOnly : true,
        path : '/',
    });
    req.body.name // 바디파서 
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send('hello post');
});

app.get('/about', (req, res) => { // JOSN 보내는 법
    res.json({hello : 'rnlduf'});
});

app.get('category/:name', (req, res) => { // 와일드카드를 사용해서 /category/name 별로 보여줌 but, express는 위에서 부터 순차적으로 실행되기 때문에 
    res.send(`hello ${req.params.name}`); // 와일드카드가 맨위에 있을 경우 밑에를 실행 시킬 수 없음 따라서 와일드카드와 모든 경로를 나타내는 *는 맨 마지막에 써야함
});

app.use((req, res, next) => { // 무조권 실행하는데 위 라우터가 실행되지 않는 경우 실행되게하는 방법 => express자체에서 라우터 에러를 지원하지만 새로 커스텀하고 싶으면 이렇게 사용
    res.send('모든 라우터를 지났는데 원하는 라우터가 없는 경우는 404인데 위에서 부터 실행 했기 떼문에 없는 라우터 입력은 여기를 실행');
});

app.use((err, req, res, next) => { // 에러가 난 경우는 여기를 실행 => 노드는 싱글스레드로 서버를 돌리기 때문에 에러가 발생하면 큰 타격이 있음 그래서 에러 경우를 설정해줘야함
    console.error(err);
    res.send('에러가 있을 경우 여기를 실행하지만 보안을 위해서 자세한건 알려주지 않기 위해서 설정함 ');
});
app.listen(app.get('port') , () => {
    console.log('expree 실행중...')
});