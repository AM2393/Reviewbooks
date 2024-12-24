import { mdiAccountCircle, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';



const Review = ({props}) => {

    const { state } = useAuth();

    // const ref = useRef(null);
    // const [width, setWidth] = useState(0)
    // useEffect(() => {
    //     console.log('width', ref.current.offsetWidth);
    // }, [ref.current])

    const [reviews, setReviews] = useState([])
    const [newReview, setNewReview] = useState("")
    const [tempValue, setTempValue] = useState(false)

    useEffect(() => {
    
    if(props.eventId) fetch(`http://localhost:3000/api/v1/reviews/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventId: props.eventId
        })
    }).then(async (response) => {
        const responseJson = await response.json();
        if (response.status < 400) {
            setReviews(responseJson);
        }
    });
    },[tempValue])


    function handleSubmitReview() {
        if(props.eventId && props.bookId && state.user.id) fetch(`http://localhost:3000/api/v1/reviews/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId: props.bookId,
                userId: state.user.id,
                eventId: props.eventId,
                text: newReview
            })
        }).then(async (response) => {
            if (response.status < 400) {
                setTempValue(!tempValue)
            }
        });
    }
    function handleRemoveReview(id) {
        console.log({id})
        if(props.eventId && props.bookId && state.user.id) fetch(`http://localhost:3000/api/v1/reviews/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                userId: state.user.id,
            })
        }).then(async (response) => {
            if (response.status < 400) {
                setTempValue(!tempValue)
            }
        });
    }



    return(<>
      <div style={{ width: "100%", justifyItems: "center"}}>
        <Card style={{width: "75%", border: 0}}>

            <h2 style={{alignSelf: "center"}}>Napsat recenzi</h2>
            <div style={{height: "2rem"}}/>

            <textarea
            style={{height: "10rem"}}
            onKeyUp={(e) => setNewReview(e.target.value)}
            />
            <div style={{height: "1rem"}}/>
            <Button
            style={{width: "6rem", alignSelf: "end"}}
            onClick={() => handleSubmitReview()}
            >
                Odeslat
            </Button>
            <div style={{height: "2rem"}}/>

            {reviews && <Card style={{border: 0}}>
                {reviews.map((e, i) => {
                    let strDate = e.created_at
                    strDate = strDate.replace("T", " ").replace("Z", "")
                    strDate = strDate.slice(0, strDate.length - 4)

                    return(
                    <>
                        <Card style={{position:"relative", boxShadow: "0px 3px 5px -1px #80808030"}}>
                            <Stack direction='horizontal' style={{paddingTop: "4px", paddingBottom: "4px"}}>
                                <div style={{position: "absolute", top: "4px", left: "4px", alignContent: "start"}}>
                                <Icon path={mdiAccountCircle} size={1.5} color={"#71430090"}/>
                                </div>
                                <div style={{paddingLeft: "46px", paddingTop: "5px"}}>
                                <Stack direction="vertical">
                                    <div style={{paddingBottom: "6px"}}>
                                    <Stack direction="horizontal">
                                        <div style={{color: "#714300", fontWeight: 500}}>{e.first_name} {e.last_name}</div>
                                        <div style={{width: "12px"}}/>
                                        <div style={{color: "#808080", fontWeight: 500}}>{strDate}</div>
                                    </Stack>
                                    </div>
                                    <div style={{color: "#000000"}}>
                                        {e.review}
                                    </div>
                                </Stack>
                                </div>
                            </Stack>
                            {e.author_id == state.user.id && <Button
                            style={{height: "24px", width: "24px", padding: 0, position: "absolute", right: 9, top: 9}}
                            onClick={() => handleRemoveReview(e.id)}
                            >
                                <Icon path={mdiClose} size={0.75} style={{marginBottom: "4px"}}/>
                            </Button>}
                        </Card>
                        <div style={{paddingBottom: "8px"}}/>
                    </>);
                })}
            </Card>}

        </Card>
      </div>
    </>)
}

export default Review