const Employee = require('../models/employee-model');
const parse = require('csv-parse').parse
const fs = require('fs');

const parseCsvAsPromise = (data) => {
  return new Promise((resolve, reject) => {
    parse(data, (err, response) => {
      if (err) reject(err);
      resolve(response);
    })
  })
}

const findEmployeeAsPromise = (property, value) => {
  return new Promise((resolve, reject) => {
    Employee.findOne({ [property]: value }, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  })
}

const shouldTransact = async ({
  full_name,
  _id,
  salary,
  login_id,
  profile_pic,
}) => {
  let shouldUpdate = false;
  const [
    employeeById,
    employeeByLoginId,
  ] = await Promise.all([
    findEmployeeAsPromise('_id', _id),
    findEmployeeAsPromise('login_id', login_id),
  ]);
  if (employeeById?._id === _id) shouldUpdate = true;
  if (employeeById && employeeByLoginId?._id !== _id) {
    throw new Error(`login_id:${employeeByLoginId.login_id} is already used. `);
  }

  if (shouldUpdate) {
    employeeById.full_name = full_name;
    employeeById.login_id = login_id;
    employeeById.salary = salary;
    employeeById.profile_pic = profile_pic;
    return () => employeeById.save()
  } else {
    const employee = new Employee({
      full_name,
      _id,
      salary,
      login_id,
      profile_pic,
    });
    return () => employee.save();
  }
}

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

const createBatchEmployeesV2 = async (req, res) => {
  const { file } = req;
  try {
    if (!file) throw new Error('Invalid Parameter');
    const data = fs.readFileSync(file.path);
    const records = await parseCsvAsPromise(data);
    const promiseArr = [];
    records.forEach(([
      _id,
      login_id,
      full_name,
      salary,
      profile_pic,
    ]) => {
      if (_id.indexOf('#') !== 0) {
        promiseArr.push(shouldTransact({
          _id,
          login_id,
          full_name,
          salary,
          profile_pic,
        }));
      }
    })
    const results = await Promise.all(promiseArr);
    results.forEach((transaction) => {
      transaction();
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: err.message || err.stack,
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
  }).catch(err => console.error(err));
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
  }).catch(err => console.error(err));
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
  }).catch(err => console.error(err));
}

const findByLoginId = async (req, res) => {
  const { query: { login_id } } = req;
  try {
    if (!login_id) throw new Error('LoginId is required');
    Employee.findOne({ login_id }, async (err, employee) => {
      if (err) throw err;
      if (!employee) res.status(404).json({ success: false, message: `User with login_id:${login_id} not found.` })
      return res.status(200).json({ success: true, data: employee })
    });
  } catch (err) {
    let statusCode = 400;
    res.status(statusCode).send({
      success: false,
      message: JSON.stringify(err),
    });
  }
}

module.exports = {
  createBatchEmployeesV2,
  createBatchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  findByLoginId,
}