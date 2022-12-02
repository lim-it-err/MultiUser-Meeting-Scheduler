# MultiUser-Meeting-Scheduler
![GithubAction Test & Build](https://github.com/lim-it-ing/MultiUser-Meeting-Scheduler/actions/workflows/npm-publish.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Purpose

This web aims to arrange each other's schedule, 
by input of each user's schedule.

Try our web to reach arrangement of available time!

![Sample App Image](./img/banner.png)

## Requirement
```
- MySQL
- Node
```

## Usage

```
$ git clone https://github.com/lim-it-ing/MultiUser-Meeting-Scheduler.git
```

Go into the project directory and run the command:

### localhost
```
$ nodemon index.js
or
$ node index.js
```

Open `http://localhost:PORT` and enjoy!

## API

## Before Run
Add this in `config/database.js`

```jsx
module.exports = {
    host     : hostip,
    user     : user,
    password : password
    database : name_of_database
};
```

`config/config.json`

```jsx
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
      "port": 3306
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
      "port": 3306
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
      "port": 3306
  }
}
```

`.env`

```jsx
SECRET_KEY = yoursecretkey
JWT_SECRET = yourjwtsecret
```
## Database Structure
### User

각 User의 개인정보를 저장합니다.

|  | Type |  | Comment |
| --- | --- | --- | --- |
| uid | string | primary | 유저 고유의 아이디 |
| password | string(40) | unique | 유저의 이름 |
| name | string | unique | 유저의 이메일 |

[](https://www.notion.so/fb8f3dacb9434b2eb24af50c645ea0d8)

### Schedule

시간표를 공유할 인원들이 속한 그룹 정보입니다.

|  | Type |  | Comment |
| --- | --- | --- | --- |
| id | int | auto_increment
primary |  |
| name | String | Unique |  |
| sched_day | Date |  | 날짜 |
| uid | String | Foreign Key | 스케줄 유저 |

### UserTimes

유저 일정의 시작 및 끝 시간을 정의합니다.

|  | Type |  | Comment |
| --- | --- | --- | --- |
| id | int | auto_increment |  |
| userid | int |  |  |
| groupid | int |  |  |
| startTime | hh:mm |  |  |
| endTime | hh:mm |  |  |

### UserSchedule
Linked Table Between User - Schedule

### API Structure

Link : https://navy-sting-049.notion.site/APIs-7aa8d40df52b42b4baf65dcd07bd4f2e

