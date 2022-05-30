const Employee = require('../models/employee-model');

const createBatchEmployees = async (req, res) => {
  const { body } = req;
  try {
    if (!body) throw new Error('Invalid Parameter');
    const promiseArr = [];
    body.forEach((employeeReqBody) => {
      const employee = new Employee(employeeReqBody);
      if (!employee) throw new Error('Invalid Parameters');
      promiseArr.push(employee.save());
    });
    await Promise.all(promiseArr);
    return res.status(201).json({
      success: true,
      message: 'Employees Created!',
    })
  } catch (err) {
    res.status(400).send({
      success: false,
      message: JSON.stringify(err),
    });
  }
}

const createEmployee = async (req, res) => {
  const { body } = req;
  try {
    if (!body) throw new Error('Invalid Parameter');
    const employee = new Employee(body);
    if (!employee) throw new Error('Invalid Parameters');
    await employee.save();
    return res.status(201).json({
      success: true,
      id: employee._id,
      message: 'Employee Created!',
    })

  } catch (err) {
    res.status(400).send({
      success: false,
      message: JSON.stringify(err),
    });
  }
};

const updateEmployee = async (req, res) => {
  const { body, params } = req;
  let statusCode = 400;
  let message = null;
  try {
    if (!body) throw new Error('Invalid Parameter');
    Employee.findOne({ _id: params.id }, async (err, employee) => {
      if (err) {
        statusCode = 404;
        message = 'Employee not found.'
        throw err;
      }
      const {
        full_name,
        login_id,
        salary,
        profile_pic,
      } = body;

      employee.full_name = full_name;
      employee.login_id = login_id;
      employee.salary = salary;
      employee.profile_pic = profile_pic;

      await employee.save();
      return res.status(200).json({
        success: true,
        id: employee._id,
        message: 'employee updated!',
      });

    });
  } catch (err) {
    res.status(statusCode).send({
      success: false,
      message: message || JSON.stringify(err),
    });
  }
}

const deleteEmployee = async (req, res) => {
  await Employee.findOneAndDelete({ _id: req.params.id }, (err, employee) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: `Employee not found` })
    }
    return res.status(200).json({ success: true, data: employee })
  }).catch(err => console.log(err))
}

const getEmployeeById = async (req, res) => {
  await Employee.findOne({ _id: req.params.id }, (err, employee) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: `Employee not found` })
    }
    return res.status(200).json({ success: true, data: employee })
  }).catch(err => console.log(err))
}

const getEmployees = async (req, res) => {
  await Employee.find({}, (err, employees) => {
      if (err) {
          return res.status(400).json({ success: false, error: err })
      }
      if (!employees.length) {
          return res
              .status(404)
              .json({ success: false, error: `Employee not found` })
      }
      return res.status(200).json({ success: true, data: employees })
  }).catch(err => console.log(err))
}

module.exports = {
  createBatchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
}