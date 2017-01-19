import {Router, Request, Response, NextFunction} from 'express';
const fileName = './../../data/data.json';
const Heroes = require(fileName);
const fs = require('fs');
const path = require('path');
const uuidV1 = require('uuid/v1');
const _remove = require('lodash.remove');


export class HeroRouter {
    router: Router;
    _self: any;


    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this._self = this;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's endpoints.
     */
    init() {
        this.router.get('/', this.getAll.bind(this));
        this.router.put('/', this.putOne.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.delete('/:id', this.deleteOne.bind(this));
        this.router.put('/:id', this.updateOne.bind(this));
    }

    /**
     * GET all Heroes
     */
    public getAll (req: Request, res: Response, next: NextFunction) {
        res.send(Heroes);
    }

    /**
     * Get one hero by id
     */
    public getOne (req: Request, res: Response, next: NextFunction) {
        let query = parseInt(req.params.id);
        let hero = Heroes.find(hero => hero.id === query);
        if(hero){
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    hero
                });
        }else{
            res.status(404)
                .send({
                    message: `No hero found with the given id. - ${query}`,
                    status: res.status
                });
        }
    }

    /**
     * DELETE hero
     */
    public deleteOne (req: Request, res: Response, next: NextFunction) {
        let query = req.params.id;
        if(query) {
            let removeHero = _remove(Heroes, (item) => {
                return item.id == query; 
            });
            if(removeHero.length === 0){
                res.status(404)
                .send({
                    message: 'Hero not found for given ID',
                    status: res.status
                });
            }else{
                this.savetoFile(res, (res) => {
                    res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        Heroes
                    })
                });
            }
        }else{
            res.status(404)
                .send({
                    message: 'Hero Id not found',
                    status: res.status
                });
        }
    }

    /**
     * UPDATE one hero
     */
    public updateOne (req: Request, res: Response, next: NextFunction) {
        let newHero = req.body.data;
        let query = req.params.id;
        if(typeof newHero == 'object' && query) {
            let hero = Heroes.find(hero => hero.id === query);
            let updatedHero = Object.assign(hero, newHero);
            _remove(Heroes, (item) => {
               return item.id == query;
            });
            Heroes.push(updatedHero);

            this.savetoFile(res, (res) => {
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        Heroes
                    });
            });

        }else{
            res.status(404)
                .send({
                    message: 'ID and/or hero details are not available',
                    status: res.status
                });
        }
    }

    /**
     * PUT one hero
     */
    public putOne (req: Request, res: Response, next: NextFunction) {
        let hero = req.body.data;
        let nextId = uuidV1();

        if(typeof hero == 'object'){
            //TODO add hero
            hero.id = nextId;
            Heroes.push(hero);
            
            this.savetoFile(res,(res) => {
                let hero = Heroes[Heroes.length - 1];
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        hero
                    })
            })

            
            
        }else{
            res.status(404)
                .send({
                    message: 'Error in saving hero',
                    status: res.status
                });
        }
    }

    /**
     * save function
     */
    public savetoFile (res: Response, onSuccess: Function) {
        fs.writeFile(path.join(__dirname, fileName), JSON.stringify(Heroes, null, 2), function(err) {
            if(err) {
                res.status(404)
                    .send({
                        message: 'Error in saving hero, I/O error',
                        stackError: JSON.stringify(err),
                        status: res.status
                    });
            }else{

                onSuccess(res);

            }
        });
    }


}

//Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;