'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
      await queryInterface.bulkInsert('Personas', [
        {
        rfc: 'AFDN360203JU1',
        nombre: 'Juan',
        email: 'juan1996@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        rfc: 'XULT350511WD8',
        nombre: 'Pedro',
        email: 'pedro2000@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    
    
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Personas', null, {});
     
  }
};