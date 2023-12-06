import React, {Fragment, useEffect, useState} from "react";
import NewBossPopup from "@/app/elements/newBossPopup";
import NewUserPopup from "@/app/elements/newUserPopup";

type UserType = {
    id: string;
    name: string;
    managerId?: string;
};

type UserTreeType = {
    name: string;
    attributes: { id: string, managerId?: string },
    children: UserTreeType[];
};


const Card = (props: any) => {


    const deleteUser = (userId: string) => {
        fetch(`http://localhost:3001/users/${userId}`, {method: 'delete'})
            .then((response) => {
                props.needRefresh()
            })
    }

    return (
        <ul>
            {props.data.map && props.data.map((item: UserTreeType) =>
                <Fragment key={item.name}>
                    <li>
                        <div className='card'>
                            <div className='card-body'>
                                <p>{item.attributes.id}</p>
                                <p>{item.name}</p>
                            </div>
                            <div className='card-footer'>
                                <button onClick={() => deleteUser(item.attributes.id)}>
                                    Удалить
                                </button>
                                <hr/>
                                <button onClick={() => props.showNewBossPopup(item.attributes.id)}>
                                    Изменить руководителя
                                </button>
                            </div>
                        </div>
                        {item.children?.length ?
                            <Card data={item.children}
                                  showNewBossPopup={props.showNewBossPopup}
                                  needRefresh={props.needRefresh}/> : null}
                    </li>
                </Fragment>
            )}
        </ul>
    );
};

const buildTreeData = (users: UserType[]): any => {
    const userMap = new Map();

    users.forEach(user => {
        userMap.set(user.id, {
            name: user.name, attributes: {
                id: user.id,
                managerId: user.managerId,
            }, children: [],
        });
    });

    const result: UserTreeType[] = [];

    users.forEach(user => {
        if (user.managerId) {
            const manager = userMap.get(user.managerId);
            manager.children.push(userMap.get(user.id));
        } else {
            result.push(userMap.get(user.id));
        }
    });

    return result;
};

const UserTree: React.FC = () => {
    const [treeData, setTreeData] = useState([]);
    const [userIdBossChange, setUserIdBossChange] = useState('');
    const [needShowNewUserPopup, setNeedShowNewUserPopup] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/users')
            .then((response) => response.json())
            .then((data) => {
                const treeData = buildTreeData(data);

                setTreeData(treeData);
            });
    }, []);

    const needRefresh = () => {
        setUserIdBossChange('');
        setNeedShowNewUserPopup(false);
        fetch('http://localhost:3001/users')
            .then((response) => response.json())
            .then((data) => {
                const treeData = buildTreeData(data);

                setTreeData(treeData);
            });
    }

    const showNewBossPopup = (userId: string) => {
        setUserIdBossChange(userId);
    };

    const showNewUserPopup = () => {
        setNeedShowNewUserPopup(true);
    };

    return (
        <div>
            <div>
                <button onClick={() => {
                    showNewUserPopup()
                }}>Создать нового пользователя
                </button>
            </div>
            <div className='org-tree'>
                {needShowNewUserPopup && <NewUserPopup needRefresh={needRefresh}/>}
                {userIdBossChange && <NewBossPopup needRefresh={needRefresh}
                                                   userId={userIdBossChange}/>}

                {treeData.map((dataElement: UserTreeType) =>
                    <div key={dataElement.name}>
                        <Card data={[dataElement]}
                              showNewBossPopup={showNewBossPopup}
                              needRefresh={needRefresh}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTree;
